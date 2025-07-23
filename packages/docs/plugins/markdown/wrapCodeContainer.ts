import { MarkdownItAsync } from 'markdown-it-async';

/**
 * markdown插件，使用 CodeContainer 组件包裹代码块，实现代码块的复制功能，显示代码块语言功能以及横向滚动功能
 * @param md markdown-it 实例
 */
export default function wrapCodeContainer(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (!token.attrGet('v-pre')) {
      token.attrSet('v-pre', '');
    }
    const preCode = fence(tokens, idx, options, env, self);
    return `
<CodeContainer lang="${token.info}" content-encoded="${encodeURIComponent(tokens[idx].content)}" :line-numbers="${Boolean(env.portal?.lineNumbers)}">
  ${preCode}
</CodeContainer>`;
  };
}
