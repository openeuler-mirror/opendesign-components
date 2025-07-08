import Markdown from 'unplugin-vue-markdown/vite';
import { MarkdownItAsync } from 'markdown-it-async';
import {  markdownItOptions, markdownItPlugins } from './common'

export const markdownItSetup = function (md: MarkdownItAsync) {
  markdownItPlugins.forEach((plugin) => md.use(plugin));
};
/**
 * vite 插件，markdown中可导入并使用vue组件；同时将 markdown 转换为 vue 组件
 */
export const plugin = Markdown({
  markdownItOptions,
  markdownItSetup,
  exclude: /\?vue&type=docs/
});
