import { type Plugin } from 'vite';
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
export function injectDemoDocs(): Plugin {
  const md = new MarkdownItAsync(markdownItOptions);
  markdownItPlugins.forEach((plugin) => md.use(plugin));
  return {
    name: 'portal:inject-demo-docs',
    transform(code, id) {
      const { query } = parseVueQuery(id);
      if (!query.vue || query.type !== 'docs' || !id.endsWith('.md')) {
        return;
      }
      const __docs: Record<string, string> = {};
      const langSeparator = /<!--\s*([a-zA-Z-]+)\s*-->/gm;
      const langMatchList = Array.from(code.matchAll(langSeparator));
      langMatchList.forEach((langMatch, matchIndex) => {
        const lang = langMatch[1];
        const langCode = code.slice(
          langMatch.index + langMatch[0].length,
          matchIndex === langMatchList.length - 1 ? code.length : langMatchList[matchIndex + 1].index,
        );
        __docs[lang] = md.render(langCode);
      });
      return `export default function (_sfc_main) {
_sfc_main.__docs = ${JSON.stringify(__docs)};
}`;
    },
  };
}
