import { type MarkdownItAsync } from 'markdown-it-async';

export const LINENUMBER_TAG_ATTR = 'data-linenumber-start';
export const LINENUMBER_CSS_ATTR = '--linenumber-start';
/**
 * markdown 插件，给pre添加 data-linenumber-start 以便属性选择器添加行号样式，给code添加css变量 --linenumber-start，以控制行号开始数字
 * @param md markdown-it 实例
 */
export default function lineNumber(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  const preCodeReg = /<pre(.*?)>(<code.*?>[\s\S]*?<\/code><\/pre>)/;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // 当代码块中有行号指令时添加行号，指令的格式为 <lang>:line-numbers[=start]
    // 如：```vue:line-numbers=3 表示显示行号，且行号从3开始
    const lineNumberReg = /:line-numbers(=\d+)?/;
    const token = tokens[idx];
    const lineNumberMatch = token.info.match(lineNumberReg);
    let originalCode = '';
    if (lineNumberMatch) {
      let start = parseInt(lineNumberMatch[1]?.slice(1) || '1');
      start = Number.isNaN(start) ? 1 : start;
      token.info = tokens[idx].info.replace(lineNumberMatch[0], '');
      let cssStr = token.attrGet('style') || '';
      if (cssStr && !cssStr.trimEnd().endsWith(';')) {
        cssStr += ';';
      }
      cssStr += `${LINENUMBER_CSS_ATTR}: ${start};`;
      token.attrSet('style', cssStr);
      originalCode = fence(tokens, idx, options, env, self);

      const codeMatch = originalCode.match(preCodeReg);
      if (codeMatch) {
        const [, preAttr, rest] = codeMatch;
        return `<pre${preAttr} ${LINENUMBER_TAG_ATTR}="${start}">${rest}`;
      }
    }
    return fence(tokens, idx, options, env, self);
  };
}
