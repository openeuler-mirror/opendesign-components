import { type Plugin, type ViteDevServer } from 'vite';
import { MarkdownItAsync } from 'markdown-it-async';
import { markdownItPlugins, markdownItOptions } from './markdown/common';
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
 * vite插件，将vue文件中的自定义块 docs 中的 markdown 保存到_sfc_main.__docs中，
 * 该内容会作为对case组件的富文本描述，被DemoContainer组件使用
 * @returns Plugin
 */
export function injectDemoDocs(): Plugin {
  const md = new MarkdownItAsync(markdownItOptions);
  markdownItPlugins.forEach((plugin) => md.use(plugin));
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
      const { query } = parseVueQuery(id);
      if (!query.vue || query.type !== 'docs' || !id.endsWith('.md')) {
        return;
      }
      const virtualIds: string[] = [];
      parseDocsCode(code).forEach(({ lang, code: langCode }) => {
        const virtualId = genVirtualId(id, lang);
        if (virtualModules.has(virtualId) && this.environment.mode === 'dev' && viteDevServer) {
          // 刷新虚拟模块，通知浏览器更新
          viteDevServer.watcher.emit('change', virtualId);
        }
        virtualModules.set(virtualId, { langCode, lang });
        virtualIds.push(virtualId);
      });
      return `${virtualIds.map((vid, index) => `import Docs${index} from ${JSON.stringify(vid)};`).join('\n')}
export default function (_sfc_main) {
  _sfc_main.__docs = {
${virtualIds
  .map((vid, index) => {
    const { lang } = virtualModules.get(vid)!;
    return `    '${lang}': Docs${index}`;
  })
  .join(',\n')}
  };
}`;
    },
  };
}
