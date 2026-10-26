// packages/opendesign/src/date-picker/composables/use-range-picker-base.ts
import { computed, provide, toRefs, Ref } from 'vue';
import dayjs from 'dayjs';
import { useFormField, type FormFieldEmits } from '../../_composables/use-form-field';
import { datePickerInjectKey } from '../provide';
import { parseValue } from '../utils';
import { isNil } from '../../_utils/is';
import { DateModelValue, DatePickerMode, DateRangePickerPropsT } from '../types';

type RangeFieldEmit = {
  (e: 'focus', evt: FocusEvent): void;
  (e: 'blur'): void;
  (e: 'clear', evt?: Event): void;
};

// mode → dayjs endOf 单位映射
const END_UNIT_MAP: Record<DatePickerMode, dayjs.OpUnitType | null> = {
  year: 'year',
  month: 'month',
  date: 'day',
  datetime: null,
};

function toTimestamp(value: DateModelValue): number | undefined {
  if (isNil(value)) return undefined;
  return parseValue(value)?.valueOf();
}

function formatOut(ts: number, valueFormat?: string): DateModelValue {
  return valueFormat === 'x' ? ts : dayjs(ts).format(valueFormat);
}

export function useRangePickerBase(opts: {
  props: DateRangePickerPropsT;
  mode: DatePickerMode;
  start: Ref<DateModelValue>;
  end: Ref<DateModelValue>;
  emit: RangeFieldEmit;
}) {
  const { props, mode, start, end, emit } = opts;
  const propsRefs = toRefs(props);
  const formField = useFormField(props, emit as FormFieldEmits);
  const modeRef = computed(() => mode);

  const startTimestamp = computed<number | undefined>({
    get: () => toTimestamp(start.value),
    set: (ts) => {
      start.value = isNil(ts) ? undefined : formatOut(ts, props.valueFormat);
    },
  });

  const endTimestamp = computed<number | undefined>({
    get: () => toTimestamp(end.value),
    set: (ts) => {
      if (isNil(ts)) {
        end.value = undefined;
        return;
      }
      const unit = END_UNIT_MAP[mode];
      const finalTs = unit ? dayjs(ts).endOf(unit).valueOf() : ts;
      end.value = formatOut(finalTs, props.valueFormat);
    },
  });

  provide(datePickerInjectKey, {
    ...propsRefs,
    mode: modeRef,
    color: formField.effectiveColor,
    disabled: formField.effectiveDisabled,
    size: formField.effectiveSize,
    round: formField.effectiveRound,
    clearable: formField.effectiveClearable,
  });

  return { startTimestamp, endTimestamp, ...formField };
}
