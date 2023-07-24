import { InjectionKey, Ref } from 'vue';

export const carouselInjectKey: InjectionKey<{
  currentIndex?: Ref<number>;
  effect: 'gallery' | 'toggle';
}> = Symbol('provide-carousel');
