import { type Plugin } from 'vite';
import { MarkdownItAsync } from 'markdown-it-async';
import { markdownItPlugins, markdownItOptions } from './markdown/common';
import matter from 'gray-matter';

const parseVueQuery = (id: string) => {
  let [file, query] = id.split('?', 2);
  if (!query) {
    return { file, query: {}, queryExtension: '' };
  }
  const queryExtension = query.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  query = queryExtension ? query.slice(0, query.length - queryExtension.length - 1) : query;
  const queryObj = query
    ? query.split('&').reduce((prev, curr) => {
        const [key, value] = curr.split('=');
        prev[key] = value || true;
        return prev;
      }, {} as Record<string, string | boolean>)
    : {};
  return { file, query: queryObj, queryExtension };
};
export function injectDemoDocs(): Plugin {
  const md = new MarkdownItAsync(markdownItOptions);
  markdownItPlugins.forEach((plugin) => md.use(plugin));
  const matterReg = /^---[\s\S]*?---/;
  return {
    name: 'portal:inject-demo-docs',
    transform(code, id) {
      const { query } = parseVueQuery(id);
      if (!query.vue || query.type !== 'docs') {
        return;
      }
      code = code.trimStart();
      const matterMatch = code.match(matterReg);
      const matterData = matterMatch ? matter(matterMatch[0]) : null;
      const h1Reg = /^#\s+(.+)/gm;
      const h1MatchList = Array.from(code.matchAll(h1Reg));
      const __docs: {
        title: Record<string, string>;
        description: Record<string, string>;
      } = { title: {}, description: {} };
      if (matterData?.data?.title) {
        __docs.title = matterData.data.title;
      }
      for (let i = 0; i < h1MatchList.length; i++) {
        const h1Match = h1MatchList[i];
        const [text, title] = h1Match;
        const nextIndex = i + 1 < h1MatchList.length ? h1MatchList[i + 1].index : Infinity;
        const desRaw = code.slice(h1Match.index + text.length, nextIndex);
        __docs.description[title] = md.render(desRaw);
      }
      return `export default function (_sfc_main) {
_sfc_main.__docs = ${JSON.stringify(__docs)};
}`;
    },
  };
}
