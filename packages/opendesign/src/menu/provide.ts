import type { InjectionKey, Ref } from 'vue';
import MenuTree from './menu';
import { type MenuSizeT } from './types.ts';

export const menuInjectKey: InjectionKey<{
  size: Ref<MenuSizeT>;
  accordion: Ref<boolean>;
  realValue: Ref<string>;
  activeNodes: Ref<Array<string | undefined>>;
  realExpanded: Ref<Array<string>>;
  arrowPosition: Ref<'left' | 'right' | undefined>;
  menuTree: MenuTree;
  notifyTreeChange: () => void;
  updateModelValue: (val: string) => void;
  updateExpanded: (val: Array<string>) => void;
}> = Symbol('provide-menu');

export const subMenuInjectKey: InjectionKey<{
  value: string;
  parentDepth: number;
}> = Symbol('provide-sub-menu');
