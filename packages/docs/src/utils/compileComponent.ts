import * as Vue from 'vue';
import { compile, type CompilerOptions } from '@vue/compiler-dom';

export function compileComponent(template: string, options: Omit<CompilerOptions, 'filename' | 'mode'> = {}): Vue.Component {
  const { code } = compile(template, {
    ...options,
    mode: 'function',
  });
  console.log('Compiled code:', code);
  const component = new Function('Vue', code)(Vue);
  return component;
}
