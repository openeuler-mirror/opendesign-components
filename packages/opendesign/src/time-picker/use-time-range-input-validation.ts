import { computed, Ref } from 'vue';

import { DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn } from './types.ts';
import { useTimePickerOptions } from './use-time-picker-options.ts';
import { isTimeBefore, isTimeAfter } from './use-time-range-constraints.ts';

interface ParsedTime {
  hour: number;
  minute: number;
  second: number;
}

export function parseTimeString(time: string | undefined): ParsedTime {
  const [hour, minute, second] = time?.split(':').map((v) => Number.parseInt(v)) ?? [];
  return { hour, minute, second };
}

export function isValidTimeUnit(value: number, options: { value: number }[], disabled: number[]): boolean {
  if (Number.isNaN(value)) return false;
  if (!options.some((opt) => opt.value === value)) return false;

  return !disabled.includes(value);
}

export function useTimeRangeInputValidation(params: {
  tempStart: Ref<string>;
  tempEnd: Ref<string>;
  format: Ref<string>;
  hourStep: Ref<number>;
  minuteStep: Ref<number>;
  secondStep: Ref<number>;
  minTime?: Ref<string | undefined>;
  maxTime?: Ref<string | undefined>;
  maxStartTime: Ref<string | undefined>;
  minEndTime: Ref<string | undefined>;
  disabledHours?: Ref<DisabledHoursFn | undefined>;
  disabledMinutes?: Ref<DisabledMinutesFn | undefined>;
  disabledSeconds?: Ref<DisabledSecondsFn | undefined>;
}) {
  const {
    tempStart,
    tempEnd,
    format,
    hourStep,
    minuteStep,
    secondStep,
    minTime,
    maxTime,
    maxStartTime,
    minEndTime,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
  } = params;

  const showSeconds = computed(() => format.value.toLowerCase().includes('ss'));

  const parsedStart = computed(() => parseTimeString(tempStart.value));
  const parsedEnd = computed(() => parseTimeString(tempEnd.value));

  const startHour = computed(() => (Number.isNaN(parsedStart.value.hour) ? null : parsedStart.value.hour));
  const startMinute = computed(() => (Number.isNaN(parsedStart.value.minute) ? null : parsedStart.value.minute));

  const endHour = computed(() => (Number.isNaN(parsedEnd.value.hour) ? null : parsedEnd.value.hour));
  const endMinute = computed(() => (Number.isNaN(parsedEnd.value.minute) ? null : parsedEnd.value.minute));

  const startMaxTime = computed(() => maxStartTime.value ?? maxTime?.value);
  const endMinTime = computed(() => minEndTime.value ?? minTime?.value);

  const startOptions = useTimePickerOptions({
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    minTime,
    maxTime: startMaxTime,
    selectedHour: startHour,
    selectedMinute: startMinute,
  });

  const endOptions = useTimePickerOptions({
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    minTime: endMinTime,
    maxTime,
    selectedHour: endHour,
    selectedMinute: endMinute,
  });

  const isStartValid = createBoundaryValidator(parsedStart, startOptions, showSeconds, startMaxTime, tempStart, isTimeAfter);
  const isEndValid = createBoundaryValidator(parsedEnd, endOptions, showSeconds, endMinTime, tempEnd, isTimeBefore);

  return { isStartValid, isEndValid };
}

function createBoundaryValidator(
  parsedTime: Ref<ParsedTime>,
  options: ReturnType<typeof useTimePickerOptions>,
  showSeconds: Ref<boolean>,
  boundaryTime: Ref<string | undefined>,
  tempTime: Ref<string>,
  checkFn: (a: string, b: string) => boolean,
) {
  return computed(() => {
    const { hour, minute, second } = parsedTime.value;

    if (!isValidTimeUnit(hour, options.hourOptions.value, options.disabledHourOptions.value)) return false;
    if (!isValidTimeUnit(minute, options.minuteOptions.value, options.disabledMinuteOptions.value)) return false;
    if (showSeconds.value && !isValidTimeUnit(second, options.secondOptions.value, options.disabledSecondOptions.value)) return false;

    return !(boundaryTime.value && tempTime.value && checkFn(tempTime.value, boundaryTime.value));
  });
}
