import { MarkdownItAsync } from 'markdown-it-async';

const HTML_REPLACEMENTS = {
  // 避免xss注入
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
function replaceCellChar(ch: string) {
  return HTML_REPLACEMENTS[ch];
}
function escapeHtml(value?: string) {
  const HTML_ESCAPE_REPLACE_RE = /[<>"']/g;
  return value ? value.replace(HTML_ESCAPE_REPLACE_RE, replaceCellChar) : '';
}
/**
 * markdown插件，通过 ^[标题]`内容` 语法，渲染popover，popover组件的target为 <OTag>标题</OTag>
 * @param md markdown-it 实例
 */
export default function popover(md: MarkdownItAsync) {
  // 定义正则表达式，匹配 ^[内容]`提示信息` 语法
  const popoverRegExp = /^\^\[([^\]]*)\](?:\((normal|primary|success|warning|danger)\))?(`[^`]*`)?/;

  md.renderer.rules.popover = function (tokens, idx) {
    const token = tokens[idx];
    const content = escapeHtml(token.content);
    const info = escapeHtml(token.info);
    return `<OPopover>
<template #target><OTag color="${token.meta?.color || 'normal'}" class="tooltip">${content}</OTag></template>
${info}
</OPopover>`;
  };

  md.inline.ruler.before('emphasis', 'popover', function (state, silent) {
    const code = state.src.slice(state.pos, state.posMax);
    const matched = code.match(popoverRegExp);
    if (!matched) {
      return false;
    }
    if (!silent) {
      const token = state.push('popover', 'popover', 0);
      token.content = matched[1].replace(/\\\|/g, '|');
      if (!token.meta) {
        token.meta = {};
      }
      token.meta.color = matched[2] || 'normal';
      token.info = (matched[3] || '').replace(/^`(.*)`$/, '$1');
      token.level = state.level;
      state.pos += matched[0].length;
    }
    return true;
  });
}
