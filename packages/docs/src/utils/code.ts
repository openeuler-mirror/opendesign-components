import { type Component } from 'vue';
import { type CompilerOptions, type CodegenResult } from '@vue/compiler-dom';
import { createHighlighter } from '../../plugins/markdown/highlight';

let Vue: any;
let highlighter: undefined | ((code: string, lang: string) => string);
let compile: undefined | ((template: string, options?: CompilerOptions) => CodegenResult);
let prettierModule: any;
let htmlPlugin: any;
let babelPlugin: any;
let postPlugin: any;
let tsPlugin: any;
let esTreePlugin: any;
/**
 * 将模板编译为组件
 * @param template 模板字符串
 * @param ctx 在模板中使用的数据
 * @param options
 * @returns 组件
 */
export async function compileComponent(template: string, ctx: any = {}, options: Omit<CompilerOptions, 'filename' | 'mode'> = {}): Promise<Component> {
  Vue = Vue ?? (await import('vue'));
  compile = compile ?? (await import('@vue/compiler-dom').then((m) => m.compile));
  const { code } = compile!(template, {
    ...options,
    mode: 'function',
  });
  const component = new Function('Vue', 'ctx', code)(Vue, ctx);
  return component;
}

export async function highlight(code: string, lang: string) {
  if (!highlighter) {
    highlighter = await createHighlighter();
  }
  return highlighter(code, lang);
}

export async function prettier(code: string, parser: string): Promise<string> {
  if (!prettierModule) {
    [prettierModule, htmlPlugin, babelPlugin, postPlugin, tsPlugin, esTreePlugin] = await Promise.all([
      import('prettier'),
      import('prettier/plugins/html'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/postcss'),
      import('prettier/plugins/typescript'),
      import('prettier/plugins/estree'),
    ]);
  }
  return prettierModule.format(code, {
    parser,
    plugins: [htmlPlugin, esTreePlugin, babelPlugin, postPlugin, tsPlugin],
    singleQuote: true,
    printWidth: 120,
  });
}
