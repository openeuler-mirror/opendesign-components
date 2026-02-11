import { InjectionKey, type ComputedRef, type Ref, type ToRefs } from 'vue';
import { sliderPropsT } from './types';

export interface SliderInjectKey extends ToRefs<sliderPropsT> {
  sliderSize: Ref<number>;
  emitChange: () => void;
  resetSize: () => void;
  updateDragging: (val: boolean) => void;
}

export const sliderInjectKey: InjectionKey<SliderInjectKey> = Symbol('provide-slider');
