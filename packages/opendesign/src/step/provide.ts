import { InjectionKey, type Ref, type ComputedRef } from 'vue';
import { type StepPropsT } from './types';

export interface StepInjectT {
  props: StepPropsT;
  stepItemHeadRefs: Ref<Array<HTMLDivElement>>;
  stepItemDividerRects: ComputedRef<Array<Record<string, string> | undefined>>;
}

export const stepInjectKey: InjectionKey<StepInjectT> = Symbol('provide-step');
