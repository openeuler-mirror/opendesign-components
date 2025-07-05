import { MarkdownItAsync, type MarkdownItAsyncOptions } from 'markdown-it-async';
import hljs from 'highlight.js';
import lineNumber from './lineNumber';
import popover from './popover';
import wrapTable from './wrapTable';
import wrapCodeContainer from './wrapCodeContainer';

export function highlight(str: string, lang: string, attrs: string) {
  let highlightLang = lang === 'vue' ? 'html' : lang;
  const hasLang = hljs.getLanguage(highlightLang);
  if (!hasLang) {
    highlightLang = 'bash';
  }
  return hljs.highlight(str, { language: highlightLang }).value;
}
export const markdownItOptions: MarkdownItAsyncOptions = {
  html: true,
  linkify: true,
  typographer: true,
  highlight,
};
export const markdownItPlugins = [lineNumber, popover, wrapCodeContainer, wrapTable];
export const md = new MarkdownItAsync(markdownItOptions);
markdownItPlugins.forEach((plugin) => md.use(plugin));
