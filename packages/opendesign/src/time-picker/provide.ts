import { ComputedRef, InjectionKey, Ref, ToRefs } from 'vue';

import { TimePickerPropsT, DatePickerColumnOption } from './types.ts';

export type TimePickerComputedOptions = {
  hourOptions: ComputedRef<DatePickerColumnOption[]>;
  minuteOptions: ComputedRef<DatePickerColumnOption[]>;
  secondOptions: ComputedRef<DatePickerColumnOption[]>;
  disabledHourOptions: ComputedRef<number[]>;
};

export type TimePickerCtx = ToRefs<
  Omit<TimePickerPropsT, 'placeholder' | 'inputId' | 'color' | 'variant' | 'optionTitle' | 'clearable' | 'trigger' | 'unmountOnHide'>
> & {
  isRange?: Ref<boolean>;
  computedOptions?: TimePickerComputedOptions;
};

export const timePickerInjectKey: InjectionKey<TimePickerCtx> = Symbol('o-time-picker');
