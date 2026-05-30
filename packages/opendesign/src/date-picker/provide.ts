import { ComputedRef, InjectionKey, Ref, ToRefs } from 'vue';

import { DatePickerMode, DatePickerPropsT } from './types.ts';

export type DatePickerCtx = ToRefs<Omit<DatePickerPropsT, 'placeholder' | 'color' | 'inputId' | 'valueFormat' | 'defaultValue'>> & {
  color: ComputedRef<string>;
  /** 选择器模式，由组件本身决定，不再从 format 推断 */
  mode: Ref<DatePickerMode>;
};

export const datePickerInjectKey: InjectionKey<DatePickerCtx> = Symbol('o-date-picker');
