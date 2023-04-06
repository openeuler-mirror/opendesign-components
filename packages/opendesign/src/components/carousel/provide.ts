import { InjectionKey, Ref } from 'vue';

export const carouselInjectKey: InjectionKey<{
  currentIndex?: Ref<number>;
  type: 'gallery';
}> = Symbol('provide-carousel');
