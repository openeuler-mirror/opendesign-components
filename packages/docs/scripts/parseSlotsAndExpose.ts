import { Project, SyntaxKind, ScriptTarget, type TypeNode, type JSDoc, type Node, type ObjectLiteralExpression, type CallExpression } from 'ts-morph';
import { promises as fsp } from 'node:fs';
import { parse } from '@vue/compiler-sfc';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tsConfigFilePath = join(fileURLToPath(import.meta.url), '../../../opendesign', 'tsconfig.app.json');
/**
 * defineExpose 参数的类型信息，包含名称、类型、描述和 JSDoc 标签
 */
export interface ExposeDefinition {
  name: string;
  type: string;
  description: string;
  tags: { name: string; text: string }[];
}

export interface Definition {
  name: string;
  type: string;
  description: string;
  tags: {
    name: string;
    text: string;
  }[];
  schema: string;
  declarations: Array<{ file: string; range: [number, number] }>;
}
const project = new Project({
  compilerOptions: {
    strict: true,
    target: ScriptTarget.Latest,
    allowJs: true,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  },
  tsConfigFilePath,
});
/**
 * 解析 JSDoc 注释，提取描述和标签信息
 * @param jsDocs JSDoc 注释数组
 * @returns 描述和标签列表（标签文本已去除 @tagName 前缀）
 */
function parseDoc(jsDocs: JSDoc[]) {
  const description = jsDocs
    .map((doc) => doc.getDescription())
    .join('\n')
    .trim();
  const tags: { name: string; text: string }[] = [];
  jsDocs.forEach((doc) => {
    doc.getTags().forEach((tag) => {
      // getText() 返回 "@tagName text"，需去除 @tagName 前缀只保留值部分
      const tagName = tag.getTagName();
      const fullText = tag.getText();
      const tagText = fullText.replace(/^@\w+\s*/, '').trim();
      tags.push({ name: tagName, text: tagText });
    });
  });
  return { description, tags };
}
const importReg = /import\([^)]+\)\./g;
function getTypeText(node: Node) {
  return node.getType().getApparentType().getText().replace(importReg, '');
}
function parseTypeArg(typeArg: TypeNode, slots: Definition[]) {
  if (typeArg.isKind(SyntaxKind.TypeLiteral)) {
    for (const member of typeArg.getMembers()) {
      let name = '';
      let type = '';
      let isParsed = false;
      if (member.isKind(SyntaxKind.PropertySignature)) {
        // 属性签名 propertyName: type
        name = member.getName();
        type = getTypeText(member);
        isParsed = true;
      } else if (member.isKind(SyntaxKind.MethodSignature)) {
        // 方法签名 methodName(paramName: type): type
        name = member.getName();
        type = getTypeText(member);
        isParsed = true;
      } else if (member.isKind(SyntaxKind.IndexSignature)) {
        // 索引签名 [key: keyType]: type
        name = member.getKeyType().getText();
        type = member.getSignature().getDeclaration().getText();
        isParsed = true;
      }
      if (isParsed) {
        const { description, tags } = parseDoc(member.getJsDocs());
        slots.push({ name, type, description, tags, schema: '', declarations: [] });
      }
    }
  }
}
/**
 * 从 defineExpose 对象字面量的原始文本中解析 JSDoc 注释和属性名
 * ts-morph 会将对象字面量内部的 JSDoc 剥离，因此需要从原始源文本提取
 * @param rawBody defineExpose 参数的原始文本（对象字面量内部内容）
 * @returns 属性名到 { description, tags } 的映射
 */
function parseExposeJSDocFromRaw(rawBody: string): Map<string, { description: string; tags: { name: string; text: string }[] }> {
  const result = new Map<string, { description: string; tags: { name: string; text: string }[] }>();
  // 匹配 JSDoc 注释（/** ... */）后紧跟的属性名，只提取注释部分和属性名
  // 支持三种属性写法：显式赋值（name:）、简写带逗号（name,）、简写无逗号收尾（name}）
  const jsDocPropRegex = /(\/\*\*[\s\S]*?\*\/)\s*(\w+)\s*(?::|,|(?=\}))/g;
  let match: RegExpExecArray | null;
  while ((match = jsDocPropRegex.exec(rawBody)) !== null) {
    const jsDocText = match[1]; // 仅 JSDoc 注释部分，不含属性名
    const propName = match[2];
    // 从 JSDoc 注释块中提取描述和标签
    const lines = jsDocText
      .replace(/^\/\*\*/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim());
    const descriptionLines: string[] = [];
    const tags: { name: string; text: string }[] = [];
    for (const line of lines) {
      const tagMatch = line.match(/^@(\w+)\s*(.*)/);
      if (tagMatch) {
        tags.push({ name: tagMatch[1], text: tagMatch[2].trim() });
      } else if (line) {
        descriptionLines.push(line);
      }
    }
    result.set(propName, { description: descriptionLines.join('<br />'), tags });
  }
  return result;
}

/**
 * 解析上下文：收集 defineSlots、defineExpose、defineEmits 的输出结果
 */
interface ParseContext {
  /** slot 定义收集数组 */
  slots: Definition[];
  /** expose 定义收集数组 */
  exposes: ExposeDefinition[];
  /** emit 标签收集数组 */
  emitTags: EmitTagInfo[];
}

/**
 * 从对象字面量表达式直接提取 expose 属性的名称、类型和 JSDoc 标签
 * @param node - defineExpose 参数的 ObjectLiteralExpression 节点
 * @param jsDocMap - 从原始文本提取的 JSDoc 映射表
 * @param exposes - 存放结果的数组
 */
function parseParamsFromObjectLiteral(
  node: ObjectLiteralExpression,
  jsDocMap: Map<string, { description: string; tags: { name: string; text: string }[] }>,
  exposes: ExposeDefinition[],
): void {
  for (const prop of node.getProperties()) {
    if (prop.isKind(SyntaxKind.SpreadAssignment)) continue;
    const name = prop.getName();
    let type = '';
    try {
      type = getTypeText(prop);
    } catch {
      type = prop.getType().getText();
    }
    const jsDocInfo = jsDocMap.get(name) ?? { description: '', tags: [] };
    exposes.push({ name, type, description: jsDocInfo.description, tags: jsDocInfo.tags });
  }
}

/** symbol 类型推断结果，包含类型文本、描述和标签列表 */
interface SymbolResolveResult {
  /** 属性的类型文本 */
  type: string;
  /** 属性的描述文本 */
  description: string;
  /** 属性的 JSDoc 标签列表 */
  tags: { name: string; text: string }[];
}

/**
 * 从 symbol 的声明列表中提取类型和 JSDoc 信息
 * @param symbol - ts-morph 属性 symbol
 * @returns 类型文本、描述和标签列表
 */
function resolveSymbolFromDeclarations(symbol: any): SymbolResolveResult {
  let type = '';
  let description = '';
  const tags: { name: string; text: string }[] = [];
  const declarations = symbol.getDeclarations();
  for (const decl of declarations) {
    try {
      type = getTypeText(decl);
    } catch {
      type = decl.getType().getText();
    }
    if (typeof decl.getJsDocs === 'function') {
      const jsDocs = decl.getJsDocs();
      if (jsDocs?.length) {
        const parsed = parseDoc(jsDocs);
        description = parsed.description;
        tags.push(...parsed.tags);
        break;
      }
    }
  }
  return { type, description, tags };
}

/**
 * 合并原始文本提取的 JSDoc 信息到已有的描述和标签中，跳过已存在的同名标签以避免重复
 * @param jsDocInfo - 从原始文本提取的 JSDoc 信息，不存在时为 undefined
 * @param description - 已有描述文本
 * @param tags - 已有标签列表
 * @returns 合并后的描述和标签
 */
function mergeJsDocMapInfo(
  jsDocInfo: { description: string; tags: { name: string; text: string }[] } | undefined,
  description: string,
  tags: { name: string; text: string }[],
): { description: string; tags: { name: string; text: string }[] } {
  if (!jsDocInfo) return { description, tags };
  const mergedTags = [...tags];
  for (const tag of jsDocInfo.tags) {
    if (!mergedTags.some((t) => t.name === tag.name)) {
      mergedTags.push(tag);
    }
  }
  return { description: jsDocInfo.description || description, tags: mergedTags };
}

/**
 * 从类型推断提取单个 symbol 的 expose 定义信息
 * @param symbol - ts-morph 的属性 symbol
 * @param jsDocMap - 从原始文本提取的 JSDoc 映射表
 * @returns expose 定义信息
 */
function processFallbackSymbol(symbol: any, jsDocMap: Map<string, { description: string; tags: { name: string; text: string }[] }>): ExposeDefinition {
  const name = symbol.getName();
  const { type, description, tags } = resolveSymbolFromDeclarations(symbol);
  const { description: mergedDesc, tags: mergedTags } = mergeJsDocMapInfo(jsDocMap.get(name), description, tags);
  return { name, type, description: mergedDesc, tags: mergedTags };
}

/**
 * 通过类型推断回退提取 expose 属性信息（无法获取 JSDoc 时的兜底方案）
 * @param node - defineExpose 参数节点
 * @param jsDocMap - 从原始文本提取的 JSDoc 映射表
 * @param exposes - 存放结果的数组
 */
function parseParamsFallback(
  node: Node,
  jsDocMap: Map<string, { description: string; tags: { name: string; text: string }[] }>,
  exposes: ExposeDefinition[],
): void {
  node
    .getType()
    .getProperties()
    .forEach((symbol) => {
      exposes.push(processFallbackSymbol(symbol, jsDocMap));
    });
}

/**
 * 解析 defineExpose 的参数，根据节点类型分发至对应解析函数
 * @param node defineExpose 的参数节点（通常是 ObjectLiteralExpression）
 * @param exposes 存放结果的数组
 */
function parseParams(node: Node, exposes: ExposeDefinition[]) {
  // 从 AST 节点获取原始文本（保留完整大括号嵌套，避免正则截断）
  const rawText = node.getText ? node.getText() : '';
  // 从原始文本中提取对象字面量内部内容（去掉首尾大括号）
  const rawBody = rawText.startsWith('{') && rawText.endsWith('}') ? rawText.slice(1, -1) : rawText;
  const jsDocMap = parseExposeJSDocFromRaw(rawBody);
  if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
    parseParamsFromObjectLiteral(node, jsDocMap, exposes);
    return;
  }
  parseParamsFallback(node, jsDocMap, exposes);
}
/**
 * 事件标签信息，包含事件名和 JSDoc 标签
 */
export interface EmitTagInfo {
  name: string;
  tags: { name: string; text: string }[];
}

/**
 * 解析 defineEmits 类型参数中的 JSDoc 标签
 * defineEmits 的 JSDoc 写在类型参数的调用签名上，vue-component-meta 无法提取这些标签
 * @param typeArg defineEmits 的类型参数（通常是 TypeLiteral）
 * @param emitTags 存放结果的数组
 */
function parseEmitTags(typeArg: TypeNode, emitTags: EmitTagInfo[]) {
  if (typeArg.isKind(SyntaxKind.TypeLiteral)) {
    for (const member of typeArg.getMembers()) {
      if (member.isKind(SyntaxKind.CallSignature)) {
        // 从签名中提取事件名：第一个参数的字符串字面量类型
        const params = member.getParameters();
        const firstParamType = params[0]?.getType()?.getText();
        // 匹配 "click" 或 'update:modelValue' 格式的事件名（含冒号等 Vue 标准事件名）
        const nameMatch = firstParamType?.match(/^["']([\w:]+)["']$/);
        if (nameMatch) {
          const name = nameMatch[1];
          const { tags } = parseDoc(member.getJsDocs());
          emitTags.push({ name, tags });
        }
      }
    }
  }
}

/**
 * 处理 defineSlots 调用表达式，提取 slot 类型信息
 * @param callExpression - defineSlots 调用表达式节点
 * @param ctx - 解析上下文，结果写入 ctx.slotsTags
 */
function handleDefineSlots(callExpression: CallExpression, ctx: ParseContext): void {
  const typeArg = callExpression.getTypeArguments()[0];
  parseTypeArg(typeArg, ctx.slots);
}

/**
 * 处理 defineExpose 调用表达式，提取 expose 属性信息
 * @param callExpression - defineExpose 调用表达式节点
 * @param ctx - 解析上下文，结果写入 ctx.exposeTags
 */
function handleDefineExpose(callExpression: CallExpression, ctx: ParseContext): void {
  const parma = callExpression.getArguments()[0];
  parseParams(parma, ctx.exposes);
}

/**
 * 处理 defineEmits 调用表达式，提取 emit 标签信息
 * @param callExpression - defineEmits 调用表达式节点
 * @param ctx - 解析上下文，结果写入 ctx.emitTags
 */
function handleDefineEmits(callExpression: CallExpression, ctx: ParseContext): void {
  const typeArg = callExpression.getTypeArguments()[0];
  if (typeArg) {
    parseEmitTags(typeArg, ctx.emitTags);
  }
}

/** define 宏名称到处理函数的查找表，替代 if/else-if 分支分发 */
const DEFINE_DISPATCH_MAP: Record<string, (callExpr: CallExpression, ctx: ParseContext) => void> = {
  defineSlots: handleDefineSlots,
  defineExpose: handleDefineExpose,
  defineEmits: handleDefineEmits,
};

/**
 * 解析 Vue 组件的 defineSlots、defineExpose 和 defineEmits，提取元数据
 * @param filePath Vue 组件文件路径
 * @returns slots、exposes 和 emitTags 数组
 */
export default async function parseSlotsAndExpose(filePath: string) {
  const ctx: ParseContext = { slots: [], exposes: [], emitTags: [] };
  const content = await fsp.readFile(filePath, 'utf-8');
  const { descriptor } = parse(content);
  if (!descriptor.scriptSetup && !descriptor.script) {
    return ctx;
  }
  const code = `${descriptor.script?.content ?? ''}\n;${descriptor.scriptSetup?.content ?? ''}`;
  const s = project.createSourceFile(`${filePath}.script.ts`, code);

  const callExpressions = s.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const callExpression of callExpressions) {
    const funName = callExpression.getExpression()?.getText();
    DEFINE_DISPATCH_MAP[funName]?.(callExpression, ctx);
  }
  return ctx;
}
