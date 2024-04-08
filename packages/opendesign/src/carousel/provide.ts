import { InjectionKey } from 'vue';

export const carouselInjectKey: InjectionKey<{
  effect: 'gallery' | 'toggle';
}> = Symbol('provide-carousel');
