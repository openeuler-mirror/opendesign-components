import { MarkdownItAsync } from 'markdown-it-async';
export default function customLinkPlugin(md: MarkdownItAsync) {
  md.renderer.rules.link_open = (tokens, idx) => {
    const token = tokens[idx];
    return `<DocLink ${token.attrs.map(([key, value]) => `${key}="${value}"`).join(' ')}>`;
  };
  md.renderer.rules.link_close = () => '</DocLink>';
}
