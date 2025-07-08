import { MarkdownItAsync } from 'markdown-it-async';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';

/**
 * markdown插件，通过 ^[标题]`内容` 语法，渲染popover，popover组件的target为 <OTag>标题</OTag>
 * @param md markdown-it 实例
 */
export default function popover(md: MarkdownItAsync) {
  // 定义正则表达式，匹配 ^[内容]`提示信息` 语法
  const popoverRegExp = /^\^\[([^\]]*)\](\(normal|primary|success|warning|danger\))?(`[^`]*`)?/;

  md.renderer.rules.popover = function (tokens, idx) {
    const token = tokens[idx];
    const content = escapeHtml(token.content);
    const info = escapeHtml(token.info);
    const target = (icon?: boolean) =>
      `<OTag color="${token.meta?.color || 'normal'}" class="tooltip">${icon ? '<template #icon><OIconInfo /></template>' : ''}${content}</OTag>`;
    if (!info) {
      return target();
    }
    return `<OPopover>
<template #target>${target(true)}</template>
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
