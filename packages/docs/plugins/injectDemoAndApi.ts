import { type Plugin, type ViteDevServer } from 'vite';
import { join, dirname } from 'node:path';
import { promises as fsp } from 'node:fs';
import { getLangByFileName } from '../helper/utils';
import { parse, type SFCBlock } from '@vue/compiler-sfc';
import { parseDocsCode, generateCode, asyncReplace } from '../helper/utils';

const entryFileRegex = /index\.([\w-]+)\.md$/;
const virtualModules = new Map<string, string>();

type ImportMeta = { path: string; default?: string; all?: string; lang?: string };
type ImportRecord = Record<string, ImportMeta>;

/** 生成 import 语句 */
const genImportedExpression = (imported: ImportRecord) => {
  return Object.values(imported)
    .map((item) => {
      let importStr = 'import ';
      if (item.default) {
        importStr += `${item.default} `;
      } else if (item.all) {
        importStr += `* as ${item.all} `;
      }
      importStr += `from ${JSON.stringify(item.path)};`;
      return importStr;
    })
    .join('\n');
};

/** 主题名称别名映射表 */
const THEME_ALIAS_MAP: Record<string, string> = {
  e: 'e',
  'open-euler': 'e',
  k: 'k',
  kunpeng: 'k',
  a: 'a',
  ascend: 'a',
  d: 'd',
  'open-design': 'd',
};

const resolveActiveTheme = (theme: string): string[] => {
  const normalized = theme.toLowerCase().replace(/^:/, '');
  return Array.from(
    new Set(
      normalized
        .split('|')
        .map((item) => THEME_ALIAS_MAP[item.trim().toLowerCase()] ?? '')
        .filter(Boolean),
    ),
  );
};

/**
 * 检查文件是否存在
 * @param filePath - 文件路径
 * @returns 文件是否存在
 */
const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fsp.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

interface VueDemoTransformContext {
  /** 组件源代码 */
  code: string;
  /** 入口文件 ID */
  id: string;
  /** 插件运行环境 */
  mode: 'dev' | 'build' | 'unknown';
  /** 激活的主题列表 */
  activeThemes?: string[];
  /** Vite 开发服务器实例 */
  viteDevServer?: ViteDevServer;
}

/**
 * 在自定义块数组中查找 docs 块的索引
 * @param customBlocks - 自定义块数组
 * @returns docs 块索引，未找到返回 -1
 */
const findDocsBlockIndex = (customBlocks: SFCBlock[]): number => {
  return customBlocks.findIndex((block) => block.type === 'docs' && block.lang === 'md');
};

interface DocsVirtualModuleContext {
  /** 入口文件 ID */
  id: string;
  /** 插件运行环境 */
  mode: 'dev' | 'build' | 'unknown';
  /** Vite 开发服务器实例 */
  viteDevServer: ViteDevServer | null;
  /** 导入记录 */
  imported: ImportRecord;
}

interface DocsVirtualModuleItem {
  /** 语言标识 */
  lang: string;
  /** 代码内容 */
  code: string;
  /** 条目索引 */
  index: number;
}

/**
 * 为单个 docs 语言块创建虚拟模块并更新导入记录
 * @param item - docs 语言块信息
 * @param ctx - 处理上下文
 */
const createDocsVirtualModule = (item: DocsVirtualModuleItem, ctx: DocsVirtualModuleContext) => {
  const virtualId = join(dirname(ctx.id), `virtual-${item.lang}.md`).replace(/\\/g, '/');
  const defaultName = `AutoInjectDocs${item.index}`;
  ctx.imported[defaultName] = { path: virtualId, default: `AutoInjectDocs${item.index}`, lang: item.lang };
  const preDocCode = virtualModules.get(virtualId);
  if (ctx.mode === 'dev' && ctx.viteDevServer && preDocCode && preDocCode !== item.code) {
    // 通知虚拟文件更新
    ctx.viteDevServer.watcher.emit('change', virtualId);
  }
  virtualModules.set(virtualId, item.code);
};

/**
 * 处理 docs 自定义块，解析多语言内容并注册虚拟模块
 * @param docsContent - docs 块内容
 * @param ctx - 处理上下文
 */
const processDocsVirtualModules = (docsContent: string, ctx: DocsVirtualModuleContext) => {
  parseDocsCode(docsContent).forEach(({ lang, code }, index) => {
    createDocsVirtualModule({ lang, code, index }, ctx);
  });
};

/**
 * 生成 docs JSON 映射条目
 * @param item - 导入项
 * @returns 映射字符串
 */
const genDocsJsonEntry = (item: ImportMeta): string => `'${item.lang}': ${item.default}`;

/**
 * 转化 case usage 指令导入的组件
 * @param ctx - 转换上下文
 * @returns 转化后的代码
 */
const transformVueDemo = ({ code, id, mode, activeThemes, viteDevServer }: VueDemoTransformContext) => {
  const imported: ImportRecord = {};
  const { customBlocks: _customBlocks, scriptSetup: _scriptSetup, styles } = parse(code).descriptor;
  // 因为要修改 customBlocks 和 scriptSetup，所以复制一份
  const customBlocks = [..._customBlocks];
  const scriptSetup = _scriptSetup ? { ..._scriptSetup } : null;
  // 处理 docs 自定义块
  const docsBlockIdx = findDocsBlockIndex(customBlocks);
  if (docsBlockIdx >= 0) {
    // 将 docs 自定义块按 zh-CN，en-US 分隔为多个虚拟模块然后导入。这些虚拟模块后经由 vueMdTranslate 插件编译为 vue 组件
    processDocsVirtualModules(customBlocks[docsBlockIdx].content, { id, mode, viteDevServer: viteDevServer ?? null, imported });
    customBlocks.splice(docsBlockIdx, 1);
    if (scriptSetup) {
      // 导入 docs 虚拟模块
      scriptSetup.content = `${scriptSetup.content}\n;${genImportedExpression(imported)}`;
    }
  }
  if (scriptSetup) {
    const styleCode = styles.map(generateCode).join('');
    scriptSetup.content = `${scriptSetup.content}\n;const _style = ${JSON.stringify(styleCode)};\n`;
  }
  const docsJson = `{${Object.values(imported).map(genDocsJsonEntry).join(',')}}`;
  // 补充 usage 的 vue 文件的 template 块
  const template = `<template><DemoUsage :schema="_oSchema" :ctx="_oCtx" :template="_oTemplate" :docs="${docsJson}" :style="_style" :active-themes='${JSON.stringify(activeThemes ?? [])}' /></template>`;
  return `${[...customBlocks, scriptSetup, ...styles].filter(Boolean).map(generateCode).join('\n')}\n${template}`;
};

interface DirectiveMatchContext {
  /** 入口文件 ID */
  id: string;
  /** 当前语言 */
  lang: string;
  /** 导入记录 */
  imported: ImportRecord;
  /** usage 模块缓存 */
  usageFiles: Map<string, string[]>;
}

/**
 * 处理单条 @case/@usage/@api 指令匹配
 * @param match - 正则匹配结果
 * @param ctx - 指令匹配上下文
 * @returns 替换后的 HTML 字符串
 */
const handleDirectiveMatch = async (match: RegExpExecArray, ctx: DirectiveMatchContext): Promise<string> => {
  const [, directive, _activeTheme, filePath] = match;
  const paths = filePath.split('/');
  const dirs = paths.slice(0, -1);
  const fileName = paths[paths.length - 1];
  const activeThemes = resolveActiveTheme(_activeTheme ?? '');

  if (directive === 'api') {
    // 导入 api 文件
    // 通过导入而非字符串替换的原因是为了将 api 文件作为一个独立的模块，
    // 当 api 文件自身更新时才能独立触发热更新
    const apiFile = join(dirname(ctx.id), ...dirs, `${fileName}-api.${ctx.lang}.md`);
    const defaultName = `AutoInjectApi${fileName}`;
    if (await fileExists(apiFile)) {
      ctx.imported[defaultName] = { path: apiFile, default: defaultName };
      return `<${defaultName} />`;
    }
  }

  // 导入 demo 文件
  const demoFile = join(dirname(ctx.id), ...dirs, `./__case__/${fileName}.vue`);
  if (await fileExists(demoFile)) {
    const importedName = `AutoInject${fileName}`;
    if (!ctx.imported[importedName]) {
      ctx.imported[importedName] = { path: demoFile, default: importedName };
    }
    if (directive === 'case') {
      return `<DemoContainer :demo="${importedName}" :active-themes='${JSON.stringify(activeThemes)}' />`;
    }
    const usageFileId = demoFile.replace(/\\/g, '/');
    ctx.usageFiles.set(usageFileId, activeThemes);
    return `<${importedName} />`;
  }

  return match[0];
};

/** 将指令case usage api转化为文件导入 */
const transformMdEntry = async (code: string, id: string, usageFiles: Map<string, string[]>) => {
  const imported: ImportRecord = {};
  const lang = getLangByFileName(id);
  // 将 <!-- @case CaseComponent --> 注释替换成 <DemoContainer :demo="AutoInjectCaseComponent" />
  // 将 <!-- @usage usageConfig --> 注释替换成 <AutoInject${fileName} />
  const ctx = { id, lang: lang.lang, imported, usageFiles };
  let transformedCode = await asyncReplace(code, /<!-{2,}\s*@(case|usage|api)(:[\w|-]+)?\s+(.*?)\s*-{2,}>/gi, (match) => handleDirectiveMatch(match, ctx));
  // 插入需要导入的模块
  const importExp = genImportedExpression(imported);
  if (importExp) {
    transformedCode += `\n\n<script setup>\n${importExp}\n</script>\n`;
  }
  return transformedCode;
};

interface TransformContext {
  /** 组件源代码 */
  code: string;
  /** 入口文件 ID */
  id: string;
  /** 插件运行环境模式 */
  mode: 'dev' | 'build' | 'unknown';
  /** Vite 开发服务器实例 */
  viteDevServer: ViteDevServer | null;
  /** usage 模块缓存 */
  usageFiles: Map<string, string[]>;
}

/**
 * 根据文件类型分发至对应的转换逻辑
 * @param ctx - 转换上下文
 * @returns 转换后的代码，或 undefined
 */
const resolveTransform = (ctx: TransformContext): string | Promise<string> | undefined => {
  // 处理 vue 文件
  if (ctx.usageFiles.has(ctx.id)) {
    return transformVueDemo({ code: ctx.code, id: ctx.id, mode: ctx.mode, activeThemes: ctx.usageFiles.get(ctx.id), viteDevServer: ctx.viteDevServer });
  }
  // 处理 md 入口文件
  if (entryFileRegex.test(ctx.id) && !ctx.id.startsWith('virtual:')) {
    return transformMdEntry(ctx.code, ctx.id, ctx.usageFiles);
  }
};

/**
 * vite 插件，在 index.<lang>.md 添加 /__docs__/__case__ 组件；拼接 api.zh-CN.md 文件
 * @returns Plugin
 */
export function injectDemoAndApi(): Plugin {
  /**
   * 缓存需要导入的usage模块
   * Map<usageId, activeTheme>
   */
  const usageFiles = new Map<string, string[]>();
  let viteDevServer: ViteDevServer | null = null;
  return {
    name: 'portal:inject-demo-and-api',
    enforce: 'pre',
    configureServer(server) {
      viteDevServer = server;
    },
    resolveId(id) {
      if (virtualModules.has(id)) {
        return id;
      }
    },
    load(id) {
      return virtualModules.get(id);
    },
    transform(code, id) {
      return resolveTransform({ code, id, mode: this.environment.mode as 'dev' | 'build' | 'unknown', viteDevServer, usageFiles });
    },
  };
}
