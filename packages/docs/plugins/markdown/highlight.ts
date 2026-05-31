import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki';
import { generateCode } from '../../helper/utils';
// 由于 @vue/compiler-sfc 包体积过大，因此使用简化的 parseSfc 函数
import { parseSfc } from '../../helper/vue-utils';

const baseConfig = {
  themes: [import('@shikijs/themes/light-plus'), import('@shikijs/themes/dark-plus')],
  engine: createJavaScriptRegexEngine(),
};

/** SFC 块定位信息（用于排序比较） */
interface SfcBlockWithOffset {
  /** 块的定位信息 */
  loc: { start: { offset: number } };
}

/**
 * 按 SFC 块起始偏移量排序的比较函数
 * @param a - 第一个块
 * @param b - 第二个块
 * @returns 偏移量差值
 */
const sortByOffset = (a: SfcBlockWithOffset, b: SfcBlockWithOffset): number => a.loc.start.offset - b.loc.start.offset;

/**
 * 将单行代码包裹为高亮行 span 标签
 * @param line - 单行代码内容
 * @returns 包裹后的 HTML 字符串
 */
const wrapLine = (line: string): string => `<span class="line">${line}</span>`;

/** Vue SFC 块高亮上下文 */
interface VueBlockHighlightContext {
  /** Vue 模板专用高亮器 */
  vueTemplateHighlighter: Awaited<ReturnType<typeof createHighlighterCore>>;
  /** 主高亮器 */
  mainHighlighter: Awaited<ReturnType<typeof createHighlighterCore>>;
  /** 主题配置 */
  themeConfig: { themes: { light: string; dark: string }; defaultColor: false };
  /** 去除 pre/code 标签函数 */
  stripPreCodeTag: (html: string) => string;
}

/**
 * 高亮单个 Vue SFC 块
 * @param block - SFC 块描述对象
 * @param ctx - 高亮上下文
 * @returns 高亮后的代码字符串
 */
const highlightVueBlock = (block: any, ctx: VueBlockHighlightContext): string => {
  const highlighter = block.type === 'template' ? ctx.vueTemplateHighlighter : ctx.mainHighlighter;
  return ctx.stripPreCodeTag(highlighter.codeToHtml(generateCode(block), { ...ctx.themeConfig, lang: 'vue' }));
};

/**
 * 创建高亮函数
 * @returns 高亮函数
 */
export const createHighlighter = async () => {
  const [mainHighlighter, vueTemplateHighlighter] = await Promise.all([
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
      return escapeHtml(code).split('\n').map(wrapLine).join('\n');
    }

    if (lang === 'vue') {
      const descriptor = parseSfc(code);
      // vue的template模块需要单独处理，因此分块高亮
      const blocks = [descriptor.script, ...descriptor.styles, descriptor.scriptSetup, ...descriptor.customBlocks, descriptor.template]
        .filter(Boolean)
        .sort(sortByOffset);

      const ctx = { vueTemplateHighlighter, mainHighlighter, themeConfig, stripPreCodeTag };
      return blocks.map((block) => highlightVueBlock(block, ctx)).join('\n');
    }

    return stripPreCodeTag(mainHighlighter.codeToHtml(code, { ...themeConfig, lang }));
  };
};
