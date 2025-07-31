import * as Vue from 'vue';
import { compile, type CompilerOptions } from '@vue/compiler-dom';

/**
 * 将模板编译为组件
 * @param template 模板字符串
 * @param ctx 在模板中使用的数据
 * @param options
 * @returns 组件
 */
export function compileComponent(template: string, ctx: any = {}, options: Omit<CompilerOptions, 'filename' | 'mode'> = {}): Vue.Component {
  const { code } = compile(template, {
    ...options,
    mode: 'function',
  });
  const component = new Function('Vue', 'ctx', code)(Vue, ctx);
  return component;
}
