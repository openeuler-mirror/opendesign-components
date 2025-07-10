// 优化后代码结构示例
import { parse } from '@vue/compiler-sfc';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki';
import darkPlus from '@shikijs/themes/dark-plus';
import lightPlus from '@shikijs/themes/light-plus';
import js from '@shikijs/langs/javascript';
import ts from '@shikijs/langs/typescript';
import json from '@shikijs/langs/json';
import html from '@shikijs/langs/html';
import css from '@shikijs/langs/css';
import bash from '@shikijs/langs/bash';
import shell from '@shikijs/langs/shell';
import vue from '@shikijs/langs/vue';
import md from '@shikijs/langs/markdown';
import yaml from '@shikijs/langs/yaml';
import jsx from '@shikijs/langs/jsx';
import tsx from '@shikijs/langs/tsx';
import scss from '@shikijs/langs/scss';
import less from '@shikijs/langs/less';
import { generateCode } from '../../helper/utils';

const baseConfig = {
  themes: [lightPlus, darkPlus],
  engine: createJavaScriptRegexEngine(),
};
/**
 * 创建高亮函数
 * @returns 高亮函数
 */
export const createHighlighter = () => {
  const mainHighlighter = createHighlighterCoreSync({
    ...baseConfig,
    langs: [js, ts, json, html, css, bash, shell, vue, md, yaml, jsx, tsx, scss, less],
  });
  // 创建Vue模板专用高亮器
  // 实测发现 markdown, yaml, jsx, tsx, scss, less 语言包会影响 vue 的 template 块高亮，导致 vue 的特殊语法高亮不准确，因此创建一个专用的模板高亮器
  const vueTemplateHighlighter = createHighlighterCoreSync({
    ...baseConfig,
    langs: [vue, js, ts, html, css],
  });

  const stripPreCodeReg = /<pre.*?><code.*?>([\s\S]*?)<\/code><\/pre>/;
  /** 去除高亮代码的首尾<pre><code>...</code></pre> */
  const stripPreCodeTag = (html: string) => html.replace(stripPreCodeReg, '$1');

  // 支持语言集合
  const supportLangs = new Set([
    'javascript',
    'js',
    'typescript',
    'ts',
    'json',
    'html',
    'css',
    'bash',
    'shell',
    'vue',
    'markdown',
    'md',
    'yaml',
    'jsx',
    'tsx',
    'scss',
    'less',
  ]);

  const themeConfig = {
    themes: { light: 'light-plus', dark: 'dark-plus' },
    defaultColor: false as const,
  };

  return function highlight(code: string, lang: string) {
    if (!supportLangs.has(lang)) {
      return escapeHtml(code)
        .split('\n')
        .map((line) => `<span class="line">${line}</span>`)
        .join('\n');
    }

    if (lang === 'vue') {
      const { descriptor } = parse(code);
      // vue的template模块需要单独处理，因此分块高亮
      const blocks = [descriptor.script, ...descriptor.styles, descriptor.scriptSetup, ...descriptor.customBlocks, descriptor.template]
        .filter(Boolean)
        .sort((a, b) => a.loc.start.offset - b.loc.start.offset);

      return blocks
        .map((block) => {
          const highlighter = block.type === 'template' ? vueTemplateHighlighter : mainHighlighter;
          return stripPreCodeTag(highlighter.codeToHtml(generateCode(block), { ...themeConfig, lang: 'vue' }));
        })
        .join('\n');
    }

    return stripPreCodeTag(mainHighlighter.codeToHtml(code, { ...themeConfig, lang }));
  };
};
