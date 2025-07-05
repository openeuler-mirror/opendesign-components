import { type MarkdownItAsync } from 'markdown-it-async';

export default function highlightLine(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
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
        return `${pre}${codeLines.map((line, index) => `<span class="line-number">${start + index}</span>${line}`).join('\n')}\n${post}`;
      }
    }
    return fence(tokens, idx, options, env, self);
  };
}
