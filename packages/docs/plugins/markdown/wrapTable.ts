import { type MarkdownItAsync } from 'markdown-it-async';

/**
 * markdown插件，给表格添加符合社区规范的样式
 * @param md markdown-it instance
 */
export default function wrapTable(md: MarkdownItAsync) {
  md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
    const attrs = tokens[idx].attrs || self.renderAttrs(tokens[idx]);
    return `<div class="o-table o-table-small portal-table"><div class="o-table-wrap o-table-border-row"><table ${attrs}>`;
  };
  md.renderer.rules.table_close = function () {
    return `</table></div></div>`;
  };
}
