import { Component, InjectionKey, Ref } from 'vue';
import MenuTree from './menu';
import { type MenuSizeT } from './types.ts';


export type ShowTooltipContent = string | number| Component
export type ShowTooltipOptions = {
  el: HTMLElement;
  /*不传取el的innerText*/
  content?: ShowTooltipContent;
}

export const menuInjectKey: InjectionKey<{
  size: Ref<MenuSizeT>;
  accordion: Ref<boolean>;
  realValue: Ref<string>;
  activeNodes: Ref<Array<string | undefined>>;
  realExpanded: Ref<Array<string>>;
  menuTree: MenuTree;
  depth: number;
  updateModelValue: (val: string) => void;
  updateExpanded: (val: Array<string>) => void;
  showTooltip: (options: ShowTooltipOptions) => void;
  hideTooltip: () => void;
}> = Symbol('provide-menu');

export const subMenuInjectKey: InjectionKey<{
  value: string;
  depth: number;
}> = Symbol('provide-sub-menu');
