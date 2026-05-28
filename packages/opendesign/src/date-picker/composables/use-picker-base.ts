// packages/opendesign/src/date-picker/composables/use-picker-base.ts
import { computed, provide, toRefs, ModelRef } from 'vue';
import { useFormField, FormFieldEmits } from '../../_composables/use-form-field';
import { datePickerInjectKey } from '../provide';
import { useTimestampValue } from './use-timestamp-value';
import { DateModelValue, DatePickerMode, DatePickerPropsT } from '../types';

export function usePickerBase(opts: { props: DatePickerPropsT; mode: DatePickerMode; modelValue: ModelRef<DateModelValue>; emit: FormFieldEmits }) {
  const { props, mode, modelValue, emit } = opts;
  const propsRefs = toRefs(props);
  const formField = useFormField(props, emit);
  const timestampValue = useTimestampValue(modelValue, propsRefs.valueFormat);

  const modeRef = computed(() => mode);

  provide(datePickerInjectKey, {
    ...propsRefs,
    mode: modeRef,
    color: formField.effectiveColor,
    disabledMonth: propsRefs.disabledMonth,
    disabledYear: propsRefs.disabledYear,
  });

  return { timestampValue, ...formField };
}
