import { type MarkdownItAsync } from 'markdown-it-async';

export const insertLineNumbers = (code: string, start: number) => {
  const codeLines = code.split('\n');
  if (codeLines[codeLines.length - 1] === '') {
    codeLines.pop();
  }
  return `${codeLines.map((line, index) => `<span class="line-number">${start + index}</span>${line}`).join('\n')}`;
};
/**
 * markdown 插件，给代码块添加行号
 * @param md markdown-it 实例
 */
export default function lineNumber(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // 当代码块中有行号指令时添加行号，指令的格式为 <lang>:line-numbers[=start]
    // 如：```vue:line-numbers=3 表示显示行号，且行号从3开始
    const lineNumberReg = /:line-numbers(=\d+)?/;
    const lineNumberMatch = tokens[idx].info.match(lineNumberReg);
    let originalCode = '';
    if (lineNumberMatch) {
      let start = parseInt(lineNumberMatch[1]?.slice(1) || '1');
      start = Number.isNaN(start) ? 1 : start;
      tokens[idx].info = tokens[idx].info.replace(lineNumberMatch[0], '');
      originalCode = fence(tokens, idx, options, env, self);
      const codeMatch = originalCode.match(/(<pre.*?><code.*?>)([\s\S]*?)(<\/code><\/pre>)/);
      if (codeMatch) {
        const [, pre, code, post] = codeMatch;
        const codeLines = code.split('\n');
        if (codeLines[codeLines.length - 1] === '') {
          codeLines.pop();
        }
        if (env.portal) {
          env.portal.lineNumbers = true;
        } else {
          env.portal = { lineNumbers: true };
        }
        return `${pre}${insertLineNumbers(code, start)}\n${post}`;
      }
    }
    return fence(tokens, idx, options, env, self);
  };
}
