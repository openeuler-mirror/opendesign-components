import { InjectionKey } from 'vue';

export const carouselInjectKey: InjectionKey<{
  effect: 'gallery' | 'toggle';
  register: () => void;
  unregister: () => void;
}> = Symbol('provide-carousel');
