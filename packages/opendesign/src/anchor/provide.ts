import { InjectionKey, Ref } from 'vue';
import type { DirectionT } from '../_utils/types';

export const anchorInjectKey: InjectionKey<{
  addLink: (link: string) => void;
  removeLink: (link: string) => void;
  /**
   * @deprecated 兼容旧版本，计划1.2.0移除
   */
  onItemClick: (options: { event: MouseEvent; link?: string }) => void;
  activeLink: Ref<string>;
  scrollIntoView: (link: string) => void;
  layout: Ref<DirectionT>;
  getChangeHash: () => boolean;
}> = Symbol('provide-anchor');

export const anchorItemInjectKey: InjectionKey<{
  depth: number;
}> = Symbol('provide-anchor');
