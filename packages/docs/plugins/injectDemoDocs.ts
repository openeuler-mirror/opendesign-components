import { type Plugin, type ViteDevServer } from 'vite';
import { MarkdownItAsync } from 'markdown-it-async';
import { markdownItPlugins, markdownItOptions } from './markdown/common';

const parseVueQuery = (id: string) => {
  let [file, query] = id.split('?', 2);
  if (!query) {
    return { file, query: {}, queryExtension: '' };
  }
  const queryExtension = query.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  query = queryExtension ? query.slice(0, query.length - queryExtension.length - 1) : query;
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

const VIRTUAL_PREFIX = 'virtual:demo-docs:';
const virtualModules = new Map<string, { langCode: string; lang: string }>();
const genVirtualId = (id: string, lang: string) => {
  return `${VIRTUAL_PREFIX}${id.split('?')[0]}-${lang}.md`;
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
      // 通过 <!-- lang --> 分割不同语言的文案块
      const langSeparator = /<!--\s*([a-zA-Z-]+)\s*-->/gm;
      const langMatchList = Array.from(code.matchAll(langSeparator));
      const virtualIds: string[] = [];
      langMatchList.forEach((langMatch, matchIndex) => {
        const lang = langMatch[1];
        const langCode = code.slice(
          langMatch.index + langMatch[0].length,
          matchIndex === langMatchList.length - 1 ? code.length : langMatchList[matchIndex + 1].index,
        );
        const virtualId = genVirtualId(id, lang);
        if (virtualModules.has(virtualId) && this.environment.mode === 'dev' && viteDevServer) {
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
