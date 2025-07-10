import { MarkdownItAsync, type MarkdownItAsyncOptions } from 'markdown-it-async';
import lineNumber from './lineNumber';
import popover from './popover';
import wrapTable from './wrapTable';
import wrapCodeContainer from './wrapCodeContainer';
import { createHighlighter } from './highlight';

export const highlight = createHighlighter();
export const markdownItOptions: MarkdownItAsyncOptions = {
  html: true,
  linkify: true,
  typographer: true,
  highlight,
};
export const markdownItPlugins = [lineNumber, popover, wrapCodeContainer, wrapTable];
/**
 * 引入项目中所有 markdown 插件，并导出 MarkdownItAsync 实例，以便在其他模块中调用
 */
export const md = new MarkdownItAsync(markdownItOptions);
markdownItPlugins.forEach((plugin) => md.use(plugin));
