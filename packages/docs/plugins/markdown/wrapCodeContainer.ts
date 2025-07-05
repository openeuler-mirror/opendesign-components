import { MarkdownItAsync } from 'markdown-it-async';

export default function wrapCodeContainer(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const preCode = fence(tokens, idx, options, env, self);

    return `
<CodeContainer lang="${token.info}" content-encoded="${encodeURIComponent(tokens[idx].content)}" :line-numbers="${Boolean(env.portal?.lineNumbers)}">
  ${preCode}
</CodeContainer>`;
  };
}
