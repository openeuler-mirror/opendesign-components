import { glob } from 'glob';
import { fileURLToPath } from 'url';
import fsp from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { type ComponentMeta, createChecker } from 'vue-component-meta';
import { type ExposeMeta } from 'vue-component-meta/lib/types';
import { parseMulti } from 'vue-docgen-api';
import parseSlotsAndExpose, { type Definition, type ExposeDefinition, type EmitTagInfo } from './parseSlotsAndExpose';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const base = join(__dirname, '../../opendesign/');
const srcDir = join(base, 'src');
const tsConfigPath = join(base, 'tsconfig.app.json');

const checker = createChecker(tsConfigPath, {
  forceUseTs: true,
  noDeclarations: true,
  printer: { newLine: 1 },
});
const CELL_REPLACEMENTS = {
  // 避免xss注入
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // unplugin-vue-markdown 插件不能正确处理单引号
  "'": '&apos;',
  // 竖线符号在markdown中会被解析为表格分隔符
  '|': '&vert;',
  // 表格中有换行符破坏markdown表格结构
  '\r': '',
  '\n': '<br />',
};
function replaceCellChar(ch: string) {
  return CELL_REPLACEMENTS[ch];
}
function escapeTableValue(value?: string) {
  const CELL_ESCAPE_REPLACE_RE = /[<>"'|\r\n]/g;
  return value ? value.replace(CELL_ESCAPE_REPLACE_RE, replaceCellChar) : '';
}
function escapeInlineCode(value: string) {
  return value.replace(/`/g, '\\`');
}
function cleanTableData(table: any[][]) {
  // 清理表格数据
  table.forEach((row) => {
    row.forEach((cell, cellIdx) => {
      row[cellIdx] = escapeTableValue(cell);
    });
  });
  // 删除空列
  const columnCount = table[0].length;
  const emptyIndexes = Array(columnCount).fill(true);
  for (let i = 0; i < columnCount; i++) {
    for (let j = 1; j < table.length; j++) {
      if (table[j][i]) {
        emptyIndexes[i] = false;
        break;
      }
    }
  }
  return table.map((row) => row.filter((_, i) => !emptyIndexes[i]));
}
/**
 * 将数组渲染为markdown表格
 * @param table 待处理的表格数据
 * @returns markdown表格
 */
function markdownTable(table: string[][]) {
  let code = '';
  // head
  code += `| ${table[0].join(' | ')} |\n`;
  code += `| ${table[0].map(() => '---').join(' | ')} |\n`;
  // body
  for (let i = 1; i < table.length; i++) {
    code += `| ${table[i].join(' | ')} |\n`;
  }
  return code;
}
/**
 * 通过vue-docgen-api库补充vue-component-meta库未能获取的Event描述
 * @param filename 待解析的vue文件
 * @param componentMeta
 * @returns
 */
async function applyTempFixForEventDescriptions(filename: string, componentMeta: ComponentMeta) {
  const hasEvents = componentMeta.events.length;

  if (!hasEvents) {
    return;
  }

  try {
    const parsedComponentDocs = await parseMulti(filename, { modules: [srcDir], nameFilter: ['default'] });
    componentMeta.events = componentMeta.events.map((event) => {
      const parsedEvent = parsedComponentDocs[0].events.find((item) => item.name === event.name);

      if (parsedEvent) {
        event.description = parsedEvent.description;
      }

      return event;
    });
  } catch {
    // noop
  }
}
/**
 * 收集 defineEmits 的 JSDoc 标签到映射表
 * @param emitTags - emit 标签信息数组
 * @returns emit 名称到标签列表的映射表
 */
function collectEmitTagsMap(emitTags: EmitTagInfo[]): Map<string, { name: string; text: string }[]> {
  const map = new Map<string, { name: string; text: string }[]>();
  emitTags.forEach((emit) => {
    if (emit.tags?.length) {
      map.set(emit.name, emit.tags);
    }
  });
  return map;
}

/**
 * 合并 slot 元数据：将 ts-morph 解析的描述和签名补充到 vue-component-meta 的 slots 中
 * @param slotMeta - ts-morph 解析的 slot 列表
 * @param componentMeta - vue-component-meta 解析的组件元数据
 * @returns slot 名称到标签列表的映射表
 */
function mergeSlotMeta(slotMeta: Definition[], componentMeta: ComponentMeta): Map<string, { name: string; text: string }[]> {
  const slotTagsMap = new Map<string, { name: string; text: string }[]>();
  slotMeta.forEach((slot) => {
    if (slot.tags?.length) {
      slotTagsMap.set(slot.name, slot.tags);
    }
    const meta = componentMeta.slots.find((item) => item.name === slot.name);
    if (meta) {
      meta.description = slot.description;
      meta.type = slot.type;
    } else {
      componentMeta.slots.push(slot);
    }
  });
  return slotTagsMap;
}

/**
 * 合并 expose 元数据：匹配名称并收集 tags，补充 vue-component-meta 未检测到的 expose
 * @param exposes - ts-morph 解析的 expose 列表
 * @param componentMeta - vue-component-meta 解析的组件元数据
 * @returns expose 名称到标签列表的映射表
 */
function mergeExposeMeta(exposes: ExposeDefinition[], componentMeta: ComponentMeta): Map<string, { name: string; text: string }[]> {
  const exposeTagsMap = new Map<string, { name: string; text: string }[]>();
  const exposedItems: ExposeMeta[] = [];
  exposes.forEach((expose) => {
    if (expose.tags?.length) {
      exposeTagsMap.set(expose.name, expose.tags);
    }
    const item = componentMeta.exposed.find((e) => e.name === expose.name);
    if (item) {
      if (expose.description) {
        item.description = expose.description;
      }
      exposedItems.push(item);
    } else {
      // vue-component-meta 未检测到的 expose，使用 ts-morph 解析的数据，补齐 ExposeMeta 必需字段
      exposedItems.push({ name: expose.name, type: expose.type, description: expose.description, declarations: [], schema: expose.type });
    }
  });
  componentMeta.exposed.length = 0;
  componentMeta.exposed.push(...exposedItems);
  return exposeTagsMap;
}

/**
 * 补充 vue-component-meta 未能解析 defineSlots 的描述和签名，同时收集 slots/expose 的 JSDoc 标签
 * @param filePath 待解析的vue文件
 * @param componentMeta vue组件元数据
 * @returns slotTagsMap 和 exposeTagsMap，用于名称列注解标签渲染
 */
async function applyTempFixForSlotAndExpose(filePath: string, componentMeta: ComponentMeta) {
  const { slots: slotMeta, exposes, emitTags } = await parseSlotsAndExpose(filePath);
  const emitTagsMap = collectEmitTagsMap(emitTags);
  const slotTagsMap = mergeSlotMeta(slotMeta, componentMeta);
  const exposeTagsMap = mergeExposeMeta(exposes, componentMeta);
  return { slotTagsMap, exposeTagsMap, emitTagsMap };
}
const pathReg = /\/(O.*)\.vue/;
/** 注解标签定义：标签名 → { color, display }，统一管理名称列行内注解的颜色与显示模式 */
const ANNOTATION_TAG_DEFS: Record<string, { color: string; display: 'text' | 'name' }> = {
  since: { color: '(primary)', display: 'text' },
  deprecated: { color: '(danger)', display: 'name' },
  experimental: { color: '(warning)', display: 'name' },
};

/** 需要从"其它"列移到名称列行内展示的标准注解标签 */
const annotationTags = Object.keys(ANNOTATION_TAG_DEFS);

/** props 表格"其它"列需排除的标签名 */
const PROPS_EXCLUDE_TAGS = ['default', 'zh-CN', 'en-US', ...annotationTags];

/** events 表格"其它"列需排除的标签名 */
const EVENTS_EXCLUDE_TAGS = ['zh-CN', 'en-US', ...annotationTags];

/**
 * 解析注解标签的显示内容：display='text' 时显示 tag.text（如版本号），display='name' 时显示标签名
 * @param def - 注解标签定义（颜色与显示模式）
 * @param tag - JSDoc 标签条目
 * @param tagName - 注解标签名
 * @returns 行内展示的内容文本
 */
function resolveAnnotationContent(def: { display: string }, tag: { text: string }, tagName: string): string {
  if (def.display === 'text') return tag.text;
  return tagName;
}

/**
 * 解析注解标签的气泡描述内容：优先使用 tag.text，display='name' 时以标签名兜底
 * @param def - 注解标签定义（颜色与显示模式）
 * @param tag - JSDoc 标签条目
 * @param tagName - 注解标签名
 * @returns 气泡描述文本
 */
function resolveAnnotationDescription(def: { display: string }, tag: { text: string }, tagName: string): string {
  if (tag.text) return tag.text;
  if (def.display === 'name') return tagName;
  return '';
}

/**
 * 构建单个注解标签的行内语法字符串
 * - since：显示版本号（tag.text），无版本号时不渲染
 * - deprecated：显示标签名，description 显示 tag.text（如 "NEXT" → 气泡展示何时弃用）
 * - experimental：显示标签名，description 显示 tag.text；text 为空时以标签名作为气泡内容
 * 当 title 和 description 内容一致时，不需要 popover 气泡（重复信息无额外价值）
 *
 * @param tagName - 注解标签名（since/deprecated/experimental）
 * @param tags - JSDoc 标签数组
 * @returns 注解标签语法字符串，无匹配或无需渲染时返回空字符串
 */
function buildSingleAnnotationTag(tagName: string, tags: { name: string; text: string }[]): string {
  const tag = tags.find((t) => t.name === tagName);
  if (!tag) return '';
  const def = ANNOTATION_TAG_DEFS[tagName];
  // since 无版本号时不渲染标签
  if (def.display === 'text' && !tag.text) return '';
  const content = resolveAnnotationContent(def, tag, tagName);
  const description = resolveAnnotationDescription(def, tag, tagName);
  // description 为空时不展示标签；content 与 description 一致时不需要 popover 气泡
  if (!description) return `^[${content}]${def.color}`;
  if (content === description) return `^[${content}]${def.color}`;
  return `^[${content}]${def.color}\`${description}\``;
}

/**
 * 构建 JSDoc 注解标签的行内语法字符串，用于名称列行内展示
 * @param tags - JSDoc 标签数组
 * @returns 拼接后的注解标签语法字符串
 */
function buildAnnotationLabel(tags: { name: string; text: string }[]): string {
  return annotationTags
    .map((tagName) => buildSingleAnnotationTag(tagName, tags))
    .filter(Boolean)
    .join(' ');
}
/**
 * 构建说明列文本：@zh-CN/@en-US 标签文本必须显示，description 有值时追加其后
 * @param lang 当前语言（zh-CN 或 en-US）
 * @param tags JSDoc 标签数组
 * @param description vue-component-meta 解析的通用描述
 * @returns 说明列文本
 */
function buildDescription(lang: string, tags: { name: string; text: string }[], description: string): string {
  const langText = tags.find((tag) => tag.name === lang)?.text ?? '';
  if (langText && description) {
    return `${langText} ${description}`;
  }
  return langText || description || '';
}

/**
 * 构建其它列的注解标签文本：过滤掉指定标签名后，将剩余标签渲染为行内语法
 * @param tags - JSDoc 标签数组
 * @param excludeTag - 需排除的标签名列表
 * @returns 拼接后的注解标签文本
 */
function buildOtherTagsCell(tags: { name: string; text: string }[], excludeTag: string[]): string {
  return tags
    .filter((tag) => !excludeTag.includes(tag.name))
    .map((tag) => `^[${tag.name}]${ANNOTATION_TAG_DEFS[tag.name]?.color ?? ''}${tag.text ? `\`${tag.text}\`` : ''}`)
    .join(' ');
}

/**
 * 构建单个 prop 的表格行数据
 * @param prop - prop 元数据
 * @param lang - 当前语言
 * @returns 表格行数组
 */
function buildPropsRow(prop: any, lang: string): string[] {
  const annotationLabel = buildAnnotationLabel(prop.tags);
  return [
    escapeInlineCode(prop.name) + (annotationLabel ? ` ${annotationLabel}` : ''),
    escapeInlineCode(prop.type),
    prop.default || prop.tags.find((tag) => tag.name === 'default')?.text || '',
    prop.required ? '🗸' : '',
    buildDescription(lang, prop.tags, prop.description),
    buildOtherTagsCell(prop.tags, PROPS_EXCLUDE_TAGS),
  ];
}

/**
 * 构建单个 event 的表格行数据
 * @param event - event 元数据
 * @param lang - 当前语言
 * @param emitTags - 该事件对应的 JSDoc 标签数组
 * @returns 表格行数组
 */
function buildEventsRow(event: any, lang: string, emitTags: { name: string; text: string }[]): string[] {
  const annotationLabel = buildAnnotationLabel(emitTags);
  return [
    escapeInlineCode(event.name) + (annotationLabel ? ` ${annotationLabel}` : ''),
    escapeInlineCode(event.signature),
    buildDescription(lang, event.tags, event.description),
    buildOtherTagsCell(event.tags, EVENTS_EXCLUDE_TAGS),
  ];
}

/**
 * 构建单个 slot 的表格行数据
 * @param slot - slot 元数据
 * @param tags - 该 slot 对应的 JSDoc 标签数组
 * @returns 表格行数组
 */
function buildSlotsRow(slot: any, tags: { name: string; text: string }[]): string[] {
  const annotationLabel = buildAnnotationLabel(tags);
  return [escapeInlineCode(slot.name) + (annotationLabel ? ` ${annotationLabel}` : ''), escapeInlineCode(slot.type), slot.description];
}

/**
 * 构建单个 expose 的表格行数据
 * @param expose - expose 元数据
 * @param tags - 该 expose 对应的 JSDoc 标签数组
 * @returns 表格行数组
 */
function buildExposeRow(expose: any, tags: { name: string; text: string }[]): string[] {
  const annotationLabel = buildAnnotationLabel(tags);
  return [escapeInlineCode(expose.name) + (annotationLabel ? ` ${annotationLabel}` : ''), escapeInlineCode(expose.type), expose.description];
}

/** 表格段落配置：统一管理各 API 段落的表头与数据 */
interface TableSectionConfig {
  /** 当前语言（zh-CN 或 en-US） */
  lang: string;
  /** 段落标题（如 props/events/slots/expose） */
  sectionTitle: string;
  /** 中文表头列名 */
  headerZh: string[];
  /** 英文表头列名 */
  headerEn: string[];
  /** 表格数据行 */
  rows: string[][];
}

/**
 * 构建一个 API 文档表格段落：含表头、数据行、markdown 表格渲染
 * @param config - 段落配置
 * @returns markdown 段落字符串，无数据时返回空字符串
 */
function buildTableSection(config: TableSectionConfig): string {
  if (!config.rows.length) return '';
  const headers = { 'zh-CN': config.headerZh, 'en-US': config.headerEn };
  let tableData = [headers[config.lang], ...config.rows];
  tableData = cleanTableData(tableData);
  return `\n\n#### ${config.sectionTitle}\n\n${markdownTable(tableData)}`;
}

/**
 * 构建 props 段落的 markdown 表格
 * @param meta - vue-component-meta 解析的组件元数据
 * @param lang - 当前语言
 * @returns props 段落 markdown 字符串，无 props 时返回空字符串
 */
function buildPropsSection(meta: ComponentMeta, lang: string): string {
  const selfProps = meta.props.filter((prop) => !prop.global);
  if (!selfProps.length) return '';
  return buildTableSection({
    lang,
    sectionTitle: 'props',
    headerZh: ['属性名', '类型', '默认值', '必填', '说明', '其它'],
    headerEn: ['Prop Name', 'Type', 'Default', 'Required', 'Description', 'Other'],
    rows: selfProps.map((prop) => buildPropsRow(prop, lang)),
  });
}

/**
 * 构建 events 段落的 markdown 表格
 * @param meta - vue-component-meta 解析的组件元数据
 * @param lang - 当前语言
 * @param emitTagsMap - emit 名称到标签列表的映射表
 * @returns events 段落 markdown 字符串，无 events 时返回空字符串
 */
function buildEventsSection(meta: ComponentMeta, lang: string, emitTagsMap: Map<string, { name: string; text: string }[]>): string {
  if (!meta.events.length) return '';
  return buildTableSection({
    lang,
    sectionTitle: 'events',
    headerZh: ['事件名', '签名', '说明', '其它'],
    headerEn: ['Event Name', 'Signature', 'Description', 'Other'],
    rows: meta.events.map((event) => buildEventsRow(event, lang, emitTagsMap.get(event.name) ?? [])),
  });
}

/**
 * 构建 slots 段落的 markdown 表格
 * @param meta - vue-component-meta 解析的组件元数据
 * @param lang - 当前语言
 * @param slotTagsMap - slot 名称到标签列表的映射表
 * @returns slots 段落 markdown 字符串，无 slots 时返回空字符串
 */
function buildSlotsSection(meta: ComponentMeta, lang: string, slotTagsMap: Map<string, { name: string; text: string }[]>): string {
  if (!meta.slots.length) return '';
  return buildTableSection({
    lang,
    sectionTitle: 'slots',
    headerZh: ['插槽', '签名', '说明'],
    headerEn: ['Slot Name', 'Signature', 'Description'],
    rows: meta.slots.map((slot) => buildSlotsRow(slot, slotTagsMap.get(slot.name) ?? [])),
  });
}

/**
 * 构建 expose 段落的 markdown 表格
 * @param meta - vue-component-meta 解析的组件元数据
 * @param lang - 当前语言
 * @param exposeTagsMap - expose 名称到标签列表的映射表
 * @returns expose 段落 markdown 字符串，无 expose 时返回空字符串
 */
function buildExposeSection(meta: ComponentMeta, lang: string, exposeTagsMap: Map<string, { name: string; text: string }[]>): string {
  if (!meta.exposed.length) return '';
  return buildTableSection({
    lang,
    sectionTitle: 'expose',
    headerZh: ['名称', '类型', '说明'],
    headerEn: ['Name', 'Type', 'Description'],
    rows: meta.exposed.map((expose) => buildExposeRow(expose, exposeTagsMap.get(expose.name) ?? [])),
  });
}

/**
 * 处理单个组件的 API 文档生成：解析元数据、构建各段落、写入 md 文件
 * @param file - 组件文件相对路径（如 OButton/OButton.vue）
 */
async function processComponentApi(file: string): Promise<void> {
  const fullPath = join(srcDir, file);
  // 解析Vue组件Api元数据
  const meta = checker.getComponentMeta(fullPath);

  await applyTempFixForEventDescriptions(fullPath, meta);
  const { slotTagsMap, exposeTagsMap, emitTagsMap } = await applyTempFixForSlotAndExpose(fullPath, meta);
  const pathMath = file.match(pathReg);
  for (const lang of ['zh-CN', 'en-US']) {
    const apiMdPath = join(fullPath, `../__docs__/${pathMath[1]}-api.${lang}.md`);
    let mdContent = `### ${pathMath[1]}`;
    mdContent += buildPropsSection(meta, lang);
    mdContent += buildEventsSection(meta, lang, emitTagsMap);
    mdContent += buildSlotsSection(meta, lang, slotTagsMap);
    mdContent += buildExposeSection(meta, lang, exposeTagsMap);
    await fsp.mkdir(dirname(apiMdPath), { recursive: true });
    await fsp.writeFile(apiMdPath, mdContent, { encoding: 'utf-8' });
  }
}

console.time('GenerateApi done');
glob('*/O*.vue', { cwd: srcDir, posix: true })
  .then(async (files) => {
    await Promise.all(files.map((file) => processComponentApi(file)));
  })
  .finally(() => {
    console.timeEnd('GenerateApi done');
  });
