import { computed, MaybeRefOrGetter, toValue } from 'vue';

import { pad, stringToDateTimeNumber } from '../_utils/time.ts';

import { DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn, DatePickerColumnOption } from './types.ts';

interface UseTimePickerOptionsParams {
  hourStep?: MaybeRefOrGetter<number | undefined>;
  minuteStep?: MaybeRefOrGetter<number | undefined>;
  secondStep?: MaybeRefOrGetter<number | undefined>;
  disabledHours?: MaybeRefOrGetter<DisabledHoursFn | undefined>;
  disabledMinutes?: MaybeRefOrGetter<DisabledMinutesFn | undefined>;
  disabledSeconds?: MaybeRefOrGetter<DisabledSecondsFn | undefined>;
  minTime?: MaybeRefOrGetter<string | undefined>;
  maxTime?: MaybeRefOrGetter<string | undefined>;
  selectedHour: MaybeRefOrGetter<number | null>;
  selectedMinute: MaybeRefOrGetter<number | null>;
}

export const useTimePickerOptions = ({
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime,
  maxTime,
  selectedHour,
  selectedMinute,
}: UseTimePickerOptionsParams) => {
  const hourOptions = computed<DatePickerColumnOption[]>(() => {
    const step = toValue(hourStep) || 1;
    const list: DatePickerColumnOption[] = [];
    for (let i = 0; i < 24; i += step) {
      list.push({ label: pad(i), value: i });
    }
    return list;
  });
  const minuteOptions = computed<DatePickerColumnOption[]>(() => {
    const step = toValue(minuteStep) || 1;
    const list: DatePickerColumnOption[] = [];
    for (let i = 0; i < 60; i += step) {
      list.push({ label: pad(i), value: i });
    }
    return list;
  });
  const secondOptions = computed<DatePickerColumnOption[]>(() => {
    const step = toValue(secondStep) || 1;
    const list: DatePickerColumnOption[] = [];
    for (let i = 0; i < 60; i += step) {
      list.push({ label: pad(i), value: i });
    }
    return list;
  });

  const parsedMinTime = computed(() => {
    const min = toValue(minTime);
    if (!min) return null;
    const parsed = stringToDateTimeNumber(min, { timeOnly: true });
    if (!parsed || parsed.hour === null || parsed.minute === null || parsed.second === null) return null;
    return parsed as { hour: number; minute: number; second: number };
  });

  const parsedMaxTime = computed(() => {
    const max = toValue(maxTime);
    if (!max) return null;
    const parsed = stringToDateTimeNumber(max, { timeOnly: true });
    if (!parsed || parsed.hour === null || parsed.minute === null || parsed.second === null) return null;
    return parsed as { hour: number; minute: number; second: number };
  });

  const disabledHourOptions = computed<number[]>(() => {
    const disabled = new Set<number>();

    const min = parsedMinTime.value;
    const max = parsedMaxTime.value;
    if (min || max) {
      hourOptions.value.forEach((opt) => {
        if (min && opt.value < min.hour) disabled.add(opt.value);
        if (max && opt.value > max.hour) disabled.add(opt.value);
      });
    }

    const disabledHoursFn = toValue(disabledHours);
    if (disabledHoursFn) {
      for (const h of disabledHoursFn()) {
        if (hourOptions.value.some((opt) => opt.value === h)) disabled.add(h);
      }
    }

    return [...disabled];
  });

  const disabledMinuteOptions = computed<number[]>(() => {
    const hour = toValue(selectedHour);
    if (hour === null) return [];
    const disabled = new Set<number>();

    const min = parsedMinTime.value;
    const max = parsedMaxTime.value;
    if (min || max) {
      minuteOptions.value.forEach((opt) => {
        if (min && hour === min.hour && opt.value < min.minute) disabled.add(opt.value);
        if (max && hour === max.hour && opt.value > max.minute) disabled.add(opt.value);
      });
    }

    const disabledMinutesFn = toValue(disabledMinutes);
    if (disabledMinutesFn) {
      for (const m of disabledMinutesFn(hour)) {
        if (minuteOptions.value.some((opt) => opt.value === m)) disabled.add(m);
      }
    }

    return [...disabled];
  });

  const disabledSecondOptions = computed<number[]>(() => {
    const hour = toValue(selectedHour);
    const minute = toValue(selectedMinute);
    if (hour === null || minute === null) return [];
    const disabled = new Set<number>();

    const min = parsedMinTime.value;
    const max = parsedMaxTime.value;
    if (min || max) {
      secondOptions.value.forEach((opt) => {
        if (min && hour === min.hour && minute === min.minute && opt.value < min.second) disabled.add(opt.value);
        if (max && hour === max.hour && minute === max.minute && opt.value > max.second) disabled.add(opt.value);
      });
    }

    const disabledSecondsFn = toValue(disabledSeconds);
    if (disabledSecondsFn) {
      for (const s of disabledSecondsFn(hour, minute)) {
        if (secondOptions.value.some((opt) => opt.value === s)) disabled.add(s);
      }
    }

    return [...disabled];
  });

  return {
    hourOptions,
    minuteOptions,
    secondOptions,
    disabledHourOptions,
    disabledMinuteOptions,
    disabledSecondOptions,
  };
};
