import { InjectionKey, Ref } from 'vue';

export const anchorInjectKey: InjectionKey<{
  addLink: (link: string) => void;
  removeLink: (link: string) => void;
  handleClick: (ev: MouseEvent, link?: string) => void;
  activeLink: Ref<string>;
}> = Symbol('provide-anchor');
