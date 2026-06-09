import { type Plugin, type ViteDevServer } from 'vite';
import { parseDocsCode } from '../helper/utils';

const parseVueQuery = (id: string) => {
  const [file, _query] = id.split('?', 2);
  if (!_query) {
    return { file, query: {}, queryExtension: '' };
  }
  const queryExtension = _query.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  const query = queryExtension ? _query.slice(0, _query.length - queryExtension.length - 1) : _query;
  const queryObj = query
    ? query.split('&').reduce(
        (prev, curr) => {
          const [key, value] = curr.split('=');
          prev[key] = value || true;
          return prev;
        },
        {} as Record<string, string | boolean>,
      )
    : {};
  return { file, query: queryObj, queryExtension };
};

const virtualModules = new Map<string, { langCode: string; lang: string }>();

const genVirtualId = (id: string, lang: string) => {
  return `${id.split('?')[0]}-virtual-${lang}.md`;
};

/**
 * 判断文件是否为 docs Vue 自定义块
 * @param id - 文件 ID
 * @returns 是否为 docs 块
 */
const isDocsVueBlock = (id: string): boolean => {
  const { query } = parseVueQuery(id);
  return !!query.vue && query.type === 'docs' && id.endsWith('.md');
};

interface DocsVirtualModuleContext {
  /** 文件 ID */
  id: string;
  /** 插件运行环境模式 */
  mode: string;
  /** Vite 开发服务器实例 */
  viteDevServer: ViteDevServer | null;
}

interface DocsVirtualModuleItem {
  /** 语言标识 */
  lang: string;
  /** 代码内容 */
  langCode: string;
}

/**
 * 为单个 docs 语言块注册虚拟模块
 * @param item - docs 语言块信息
 * @param ctx - 处理上下文
 * @returns 虚拟模块 ID
 */
const registerDocsVirtualModule = (item: DocsVirtualModuleItem, ctx: DocsVirtualModuleContext): string => {
  const virtualId = genVirtualId(ctx.id, item.lang);
  if (virtualModules.has(virtualId) && ctx.mode === 'dev' && ctx.viteDevServer) {
    // 刷新虚拟模块，通知浏览器更新
    ctx.viteDevServer.watcher.emit('change', virtualId);
  }
  virtualModules.set(virtualId, { langCode: item.langCode, lang: item.lang });
  return virtualId;
};

/**
 * 处理 docs 自定义块的虚拟模块，解析多语言内容并注册虚拟模块
 * @param code - 自定义块源代码
 * @param ctx - 处理上下文
 * @returns 虚拟模块 ID 数组
 */
const processDemoDocsVirtualModules = (code: string, ctx: DocsVirtualModuleContext): string[] => {
  return parseDocsCode(code).map(({ lang, code: langCode }) => registerDocsVirtualModule({ lang, langCode }, ctx));
};

/**
 * 生成单个 docs 虚拟模块的导入语句
 * @param vid - 虚拟模块 ID
 * @param index - 模块索引
 * @returns 导入语句字符串
 */
const generateDocsImportStatement = (vid: string, index: number): string => {
  return `import Docs${index} from ${JSON.stringify(vid)};`;
};

/**
 * 生成单个 docs 虚拟模块的属性映射条目
 * @param vid - 虚拟模块 ID
 * @param index - 模块索引
 * @returns 属性映射字符串
 */
const generateDocsMapEntry = (vid: string, index: number): string => {
  const { lang } = virtualModules.get(vid)!;
  return `    '${lang}': Docs${index}`;
};

/**
 * 生成 docs 虚拟模块的导入和挂载代码
 * @param virtualIds - 虚拟模块 ID 数组
 * @returns 生成的模块代码字符串
 */
const generateDocsModuleCode = (virtualIds: string[]): string => {
  const imports = virtualIds.map(generateDocsImportStatement).join('\n');
  const docsMap = virtualIds.map(generateDocsMapEntry).join(',\n');
  return `${imports}\nexport default function (_sfc_main) {\n  _sfc_main.__docs = {\n${docsMap}\n  };}`;
};

interface DocsTransformContext {
  /** 自定义块源代码 */
  code: string;
  /** 文件 ID */
  id: string;
  /** 插件运行环境模式 */
  mode: string;
  /** Vite 开发服务器实例 */
  viteDevServer: ViteDevServer | null;
}

/**
 * 解析 docs 自定义块的转换逻辑
 * @param ctx - 转换上下文
 * @returns 转换后的代码，或 undefined（非 docs 块时）
 */
const resolveDocsTransform = (ctx: DocsTransformContext): string | undefined => {
  if (!isDocsVueBlock(ctx.id)) {
    return;
  }
  const virtualIds = processDemoDocsVirtualModules(ctx.code, { id: ctx.id, mode: ctx.mode, viteDevServer: ctx.viteDevServer });
  return generateDocsModuleCode(virtualIds);
};

/**
 * vite插件，将vue文件中的自定义块 docs 中的 markdown 保存到_sfc_main.__docs中，
 * 该内容会作为对case组件的富文本描述，被DemoContainer组件使用
 * @returns Plugin
 */
export function injectDemoDocs(): Plugin {
  let viteDevServer: ViteDevServer | null = null;
  return {
    name: 'portal:inject-demo-docs',
    configureServer(server) {
      viteDevServer = server;
    },
    resolveId(id) {
      if (virtualModules.has(id)) {
        return id;
      }
    },
    load(id) {
      return virtualModules.get(id)?.langCode;
    },
    transform(code, id) {
      return resolveDocsTransform({ code, id, mode: this.environment.mode, viteDevServer });
    },
  };
}
