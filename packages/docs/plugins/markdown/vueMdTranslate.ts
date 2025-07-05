import Markdown from 'unplugin-vue-markdown/vite';
import { MarkdownItAsync } from 'markdown-it-async';
import {  markdownItOptions, markdownItPlugins } from './common'

export const markdownItSetup = function (md: MarkdownItAsync) {
  markdownItPlugins.forEach((plugin) => md.use(plugin));
};
export const plugin = Markdown({
  markdownItOptions,
  markdownItSetup,
  exclude: /\?vue&type=docs/
});
