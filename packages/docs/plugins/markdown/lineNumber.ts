import { type MarkdownItAsync } from 'markdown-it-async';

export const LINENUMBER_TAG_ATTR = 'data-linenumber-start';
export const LINENUMBER_CSS_ATTR = '--linenumber-start';

const preCodeReg = /<pre(.*?)>(<code.*?>[\s\S]*?<\/code><\/pre>)/;

/** Fence 渲染上下文（封装 markdown-it 的 5 个渲染参数） */
interface FenceRenderContext {
  /** markdown-it token 数组 */
  tokens: any[];
  /** 当前 token 索引 */
  idx: number;
  /** markdown-it 选项 */
  options: any;
  /** markdown-it 环境 */
  env: any;
  /** markdown-it 渲染器自身 */
  self: any;
}

/**
 * 处理带行号指令的代码块渲染
 * @param ctx - Fence 渲染上下文
 * @param originalFence - 原始 fence 渲染函数
 * @returns 渲染后的 HTML 字符串
 */
const renderFenceWithLineNumber = (ctx: FenceRenderContext, originalFence: (...args: any[]) => string): string => {
  const lineNumberReg = /:line-numbers(=\d+)?/;
  const token = ctx.tokens[ctx.idx];
  const lineNumberMatch = token.info.match(lineNumberReg);

  if (lineNumberMatch) {
    let start = parseInt(lineNumberMatch[1]?.slice(1) ?? '1');
    start = Number.isNaN(start) ? 1 : start;
    token.info = token.info.replace(lineNumberMatch[0], '');
    let cssStr = token.attrGet('style') ?? '';
    if (cssStr && !cssStr.trimEnd().endsWith(';')) {
      cssStr += ';';
    }
    cssStr += `${LINENUMBER_CSS_ATTR}: ${start};`;
    token.attrSet('style', cssStr);
    const originalCode = originalFence(ctx.tokens, ctx.idx, ctx.options, ctx.env, ctx.self);

    const codeMatch = originalCode.match(preCodeReg);
    if (codeMatch) {
      const [, preAttr, rest] = codeMatch;
      return `<pre${preAttr} ${LINENUMBER_TAG_ATTR}="${start}">${rest}`;
    }
  }
  return originalFence(ctx.tokens, ctx.idx, ctx.options, ctx.env, ctx.self);
};

/**
 * markdown 插件，给pre添加 data-linenumber-start 以便属性选择器添加行号样式，给code添加css变量 --linenumber-start，以控制行号开始数字
 * @param md markdown-it 实例
 */
export default function lineNumber(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => renderFenceWithLineNumber({ tokens: args[0], idx: args[1], options: args[2], env: args[3], self: args[4] }, fence);
}
