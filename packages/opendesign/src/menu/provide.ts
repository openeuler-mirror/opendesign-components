import { InjectionKey, Ref } from 'vue';
import MenuTree from './menu';

export const menuInjectKey: InjectionKey<{
  accordion: Ref<boolean>;
  levelIndent: Ref<number>;
  realValue: Ref<string>;
  activeNodes: Ref<Array<string | undefined>>;
  realExpanded: Ref<Array<string>>;
  menuTree: MenuTree;
  depth: number;
  updateModelValue: (val: string) => void;
  updateExpanded: (val: Array<string>) => void;
}> = Symbol('provide-menu');

export const subMenuInjectKey: InjectionKey<{
  value: string;
  depth: number;
}> = Symbol('provide-sub-menu');
