// packages/opendesign/src/date-picker/composables/use-timestamp-value.ts
import { computed, WritableComputedRef, ModelRef, Ref, toValue } from 'vue';
import dayjs from 'dayjs';
import { isNil } from '../../_utils/is';
import { DateModelValue } from '../types';
import { parseValue } from '../utils';

export function useTimestampValue(modelValue: ModelRef<DateModelValue>, valueFormat?: Ref<string | undefined>): WritableComputedRef<number | undefined> {
  return computed<number | undefined>({
    get() {
      return parseValue(modelValue.value)?.valueOf();
    },
    set(ts) {
      if (isNil(ts)) {
        modelValue.value = undefined;
        return;
      }
      if (toValue(valueFormat) === 'x') {
        modelValue.value = ts;
      } else {
        modelValue.value = dayjs(ts).format(toValue(valueFormat));
      }
    },
  });
}
