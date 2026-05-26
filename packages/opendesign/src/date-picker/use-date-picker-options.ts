import { computed, Ref } from 'vue';
import dayjs from 'dayjs';

import { useI18n } from '../locale';
import { DatePickerColumnOption } from '../time-picker/types.ts';

import { DisabledDateFn, DisabledMonthFn, DisabledYearFn } from './types.ts';

interface UseDatePickerOptionsParams {
  currentYear: Ref<number>;
  currentMonth: Ref<number>;
  disabledDate?: Ref<DisabledDateFn | undefined>;
  disabledMonth?: Ref<DisabledMonthFn | undefined>;
  disabledYear?: Ref<DisabledYearFn | undefined>;
  minDate?: Ref<Date | string | number | null | undefined>;
  maxDate?: Ref<Date | string | number | null | undefined>;
}

export const useDatePickerOptions = ({
  currentYear,
  currentMonth,
  disabledDate,
  disabledMonth,
  disabledYear,
  minDate,
  maxDate,
}: UseDatePickerOptionsParams) => {
  const { t } = useI18n();
  const parsedMinDate = computed(() => {
    if (!minDate?.value) return null;
    return dayjs(minDate.value);
  });

  const parsedMaxDate = computed(() => {
    if (!maxDate?.value) return null;
    return dayjs(maxDate.value);
  });

  const yearOptions = computed<DatePickerColumnOption[]>(() => {
    const unit = t('datePicker.yearUnit');
    const minYear = parsedMinDate.value ? parsedMinDate.value.year() : 1900;
    const maxYear = parsedMaxDate.value ? parsedMaxDate.value.year() : 2100;
    const years: DatePickerColumnOption[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      years.push({ label: `${y}${unit}`, value: y });
    }
    return years;
  });

  const monthOptions = computed<DatePickerColumnOption[]>(() => {
    const minMonth = parsedMinDate.value && currentYear.value === parsedMinDate.value.year() ? parsedMinDate.value.month() : 0;
    const maxMonth = parsedMaxDate.value && currentYear.value === parsedMaxDate.value.year() ? parsedMaxDate.value.month() : 11;
    const months: DatePickerColumnOption[] = [];
    for (let m = minMonth; m <= maxMonth; m++) {
      months.push({ label: t(`datePicker.monthsShort.${m}`), value: m });
    }
    return months;
  });

  const dayOptions = computed<DatePickerColumnOption[]>(() => {
    const unit = t('datePicker.dayUnit');
    const daysInMonth = dayjs().year(currentYear.value).month(currentMonth.value).daysInMonth();
    const minDay =
      parsedMinDate.value && currentYear.value === parsedMinDate.value.year() && currentMonth.value === parsedMinDate.value.month()
        ? parsedMinDate.value.date()
        : 1;
    const maxDay =
      parsedMaxDate.value && currentYear.value === parsedMaxDate.value.year() && currentMonth.value === parsedMaxDate.value.month()
        ? parsedMaxDate.value.date()
        : daysInMonth;
    const days: DatePickerColumnOption[] = [];
    for (let d = minDay; d <= maxDay; d++) {
      days.push({ label: `${d}${unit}`, value: d });
    }
    return days;
  });

  const disabledMonthOptions = computed<number[] | undefined>(() => {
    if (!disabledDate?.value && !disabledMonth?.value) return undefined;
    const disabled: number[] = [];
    for (let m = 0; m < 12; m++) {
      const testDate = dayjs().year(currentYear.value).month(m).date(1);
      const params = { date: testDate.toDate(), year: testDate.year(), month: testDate.month(), day: testDate.date() };
      if (disabledMonth?.value?.(params)) {
        disabled.push(m);
      } else if (disabledDate?.value?.(params)) {
        disabled.push(m);
      }
    }
    return disabled.length > 0 ? disabled : undefined;
  });

  const disabledDayOptions = computed<number[] | undefined>(() => {
    if (!disabledDate?.value) return undefined;
    const disabled: number[] = [];
    for (let d = 1; d <= 31; d++) {
      const testDate = dayjs().year(currentYear.value).month(currentMonth.value).date(d);
      if (testDate.month() !== currentMonth.value && d > testDate.daysInMonth()) break;
      const params = { date: testDate.toDate(), year: testDate.year(), month: testDate.month(), day: testDate.date() };
      if (disabledDate.value(params)) {
        disabled.push(d);
      }
    }
    return disabled.length > 0 ? disabled : undefined;
  });

  const disabledYearOptions = computed<number[] | undefined>(() => {
    if (!disabledDate?.value && !disabledYear?.value) return undefined;
    const disabled: number[] = [];
    for (const opt of yearOptions.value) {
      const testDate = dayjs().year(opt.value).month(0).date(1);
      if (disabledYear?.value?.({ date: testDate.toDate(), year: testDate.year() })) {
        disabled.push(opt.value);
      } else if (disabledDate?.value?.({ date: testDate.toDate(), year: testDate.year(), month: 0, day: 1 })) {
        disabled.push(opt.value);
      }
    }
    return disabled.length > 0 ? disabled : undefined;
  });

  return {
    yearOptions,
    monthOptions,
    dayOptions,
    disabledYearOptions,
    disabledMonthOptions,
    disabledDayOptions,
  };
};
