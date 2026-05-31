import { MarkdownItAsync } from 'markdown-it-async';
import { TAG_INLINE_MARGIN_LEFT } from '../../shared/inlineTagConstants';

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

/** 匹配 ^[内容](颜色)?`tooltip`? 语法 */
const popoverRegExp = /^\^\[([^\]]*)\](?:\((normal|primary|success|warning|danger)\))?(`[^`]*`)?/;

/**
 * 渲染 popover token 为 HTML
 * @param tokens - markdown-it token 数组
 * @param idx - 当前 token 索引
 * @returns 渲染后的 HTML 字符串
 */
const renderPopoverToken = (tokens: any[], idx: number): string => {
  const token = tokens[idx];
  const content = escapeHtml(token.content);
  const info = escapeHtml(token.info);
  const color = token.meta?.color ?? 'normal';

  if (info) {
    // 有 tooltip：Popover 包裹的 OTag，用于术语标注等场景
    // data-annotation-* 属性供 getHeads 运行时从 DOM 反向提取完整 ^[]()`` 语法
    const tagCode = `<OTag size="small" variant="outline" color="${color}" class="tooltip" data-annotation-text="${content}" data-annotation-color="${color}" data-annotation-tooltip="${info}">${content}</OTag>`;
    return `<OPopover>\n<template #target>${tagCode}</template>\n${info}\n</OPopover>`;
  }

  // 无 tooltip：行内 OTag，用于 since/deprecated/experimental 等注解标签
  // data-annotation-* 属性供 getHeads 运行时从 DOM 反向提取 ^[]() 语法
  return `<OTag size="small" variant="outline" color="${color}" data-annotation-text="${content}" data-annotation-color="${color}" style="margin-left: ${TAG_INLINE_MARGIN_LEFT};">${content}</OTag>`;
};

/**
 * 解析 popover 行内语法
 * @param state - markdown-it 状态对象
 * @param silent - 是否静默模式
 * @returns 是否成功匹配
 */
const parsePopoverInline = (state: any, silent: boolean): boolean => {
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
    token.meta.color = matched[2] ?? 'normal';
    token.info = (matched[3] ?? '').replace(/^`(.*)`$/, '$1');
    token.level = state.level;
    state.pos += matched[0].length;
  }
  return true;
};

/**
 * markdown插件，通过 ^[标题]`内容` 语法，渲染popover或行内标签
 *
 * - 有tooltip（`内容`）时：渲染为 OPopover + OTag（popover的target）
 * - 无tooltip时：渲染为行内 OTag（带 size="small" variant="outline"，适合注解标签如 since/deprecated/experimental）
 *
 * @param md markdown-it 实例
 */
export default function popover(md: MarkdownItAsync) {
  md.renderer.rules.popover = (...args) => renderPopoverToken(args[0], args[1]);
  md.inline.ruler.before('emphasis', 'popover', parsePopoverInline);
}
