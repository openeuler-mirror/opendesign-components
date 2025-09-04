// 优化后代码结构示例
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki';
import { generateCode } from '../../helper/utils';

const baseConfig = {
  themes: [import('@shikijs/themes/light-plus'), import('@shikijs/themes/dark-plus')],
  engine: createJavaScriptRegexEngine(),
};
/**
 * 创建高亮函数
 * @returns 高亮函数
 */
export const createHighlighter = async () => {
  const [mainHighlighter, vueTemplateHighlighter, parse] = await Promise.all([
    createHighlighterCore({
      ...baseConfig,
      langs: [
        import('@shikijs/langs/js'),
        import('@shikijs/langs/ts'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/bash'),
        import('@shikijs/langs/shell'),
        import('@shikijs/langs/vue'),
        import('@shikijs/langs/md'),
        import('@shikijs/langs/yaml'),
        import('@shikijs/langs/jsx'),
        import('@shikijs/langs/tsx'),
        import('@shikijs/langs/scss'),
        import('@shikijs/langs/less'),
      ],
    }),
    // 创建Vue模板专用高亮器
    // 实测发现 markdown, yaml, jsx, tsx, scss, less 语言包会影响 vue 的 template 块高亮，导致 vue 的特殊语法高亮不准确，因此创建一个专用的模板高亮器
    createHighlighterCore({
      ...baseConfig,
      langs: [
        import('@shikijs/langs/vue'),
        import('@shikijs/langs/js'),
        import('@shikijs/langs/ts'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/css'),
      ],
    }),
    import('@vue/compiler-sfc').then((r) => r.parse),
  ]);

  const stripPreCodeReg = /<pre.*?><code.*?>([\s\S]*?)<\/code><\/pre>/;
  /** 去除高亮代码的首尾<pre><code>...</code></pre> */
  const stripPreCodeTag = (htmlCode: string) => htmlCode.replace(stripPreCodeReg, '$1');

  // 支持语言集合
  const supportLangs = new Set([
    'javascript',
    'js',
    'typescript',
    'ts',
    'json',
    'html',
    'css',
    'bash',
    'shell',
    'vue',
    'markdown',
    'md',
    'yaml',
    'jsx',
    'tsx',
    'scss',
    'less',
  ]);

  const themeConfig = {
    themes: { light: 'light-plus', dark: 'dark-plus' },
    defaultColor: false as const,
  };

  return function highlight(code: string, lang: string) {
    if (!supportLangs.has(lang)) {
      return escapeHtml(code)
        .split('\n')
        .map((line) => `<span class="line">${line}</span>`)
        .join('\n');
    }

    if (lang === 'vue') {
      const { descriptor } = parse(code);
      // vue的template模块需要单独处理，因此分块高亮
      const blocks = [descriptor.script, ...descriptor.styles, descriptor.scriptSetup, ...descriptor.customBlocks, descriptor.template]
        .filter(Boolean)
        .sort((a, b) => a.loc.start.offset - b.loc.start.offset);

      return blocks
        .map((block) => {
          const highlighter = block.type === 'template' ? vueTemplateHighlighter : mainHighlighter;
          return stripPreCodeTag(highlighter.codeToHtml(generateCode(block), { ...themeConfig, lang: 'vue' }));
        })
        .join('\n');
    }

    return stripPreCodeTag(mainHighlighter.codeToHtml(code, { ...themeConfig, lang }));
  };
};
