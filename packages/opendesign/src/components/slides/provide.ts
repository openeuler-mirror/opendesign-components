import { InjectionKey, Ref } from 'vue';

export const slidesInjectKey: InjectionKey<{
  currentIndex?: Ref<number>;
  type: 'carousel' | 'switch' | 'gallery';
}> = Symbol('provide-slides');
