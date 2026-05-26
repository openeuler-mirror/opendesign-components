import dayjs from 'dayjs';

import { pad } from '../_utils/time.ts';

import { DatePickerColumnOption, DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn } from './types.ts';
import { TIME_PREFIX } from './use-time-range-constraints.ts';

interface BoundaryParams {
  options: DatePickerColumnOption[];
  minBoundary?: { match: boolean; value: number };
  maxBoundary?: { match: boolean; value: number };
  disabledFn?: () => number[];
}

function buildDisabledSet({ options, minBoundary, maxBoundary, disabledFn }: BoundaryParams): Set<number> {
  const disabled = new Set<number>();
  for (const opt of options) {
    if (minBoundary?.match && opt.value < minBoundary.value) disabled.add(opt.value);
    if (maxBoundary?.match && opt.value > maxBoundary.value) disabled.add(opt.value);
  }
  disabledFn?.().forEach((v) => {
    if (options.some((opt) => opt.value === v)) disabled.add(v);
  });
  return disabled;
}

function findClosest(options: DatePickerColumnOption[], disabled: Set<number>, target: number): number | undefined {
  const enabled = options.filter((opt) => !disabled.has(opt.value));
  if (enabled.length === 0) return undefined;
  const atOrAfter = enabled.find((opt) => opt.value >= target);
  return atOrAfter ? atOrAfter.value : enabled[enabled.length - 1].value;
}

interface TimeBounds {
  minT: dayjs.Dayjs | null;
  maxT: dayjs.Dayjs | null;
}

function resolveHour(options: DatePickerColumnOption[], bounds: TimeBounds, disabledFn: DisabledHoursFn | undefined, target: number): number | undefined {
  const disabled = buildDisabledSet({
    options,
    minBoundary: bounds.minT ? { match: true, value: bounds.minT.hour() } : undefined,
    maxBoundary: bounds.maxT ? { match: true, value: bounds.maxT.hour() } : undefined,
    disabledFn,
  });
  return findClosest(options, disabled, target);
}

function resolveMinute(
  options: DatePickerColumnOption[],
  bounds: TimeBounds,
  h: number,
  disabledFn: DisabledMinutesFn | undefined,
  target: number,
): number | undefined {
  const disabled = buildDisabledSet({
    options,
    minBoundary: { match: h === bounds.minT?.hour(), value: bounds.minT?.minute() ?? 0 },
    maxBoundary: { match: h === bounds.maxT?.hour(), value: bounds.maxT?.minute() ?? 59 },
    disabledFn: disabledFn ? () => disabledFn(h) : undefined,
  });
  return findClosest(options, disabled, target);
}

function resolveSecond(
  options: DatePickerColumnOption[],
  bounds: TimeBounds,
  h: number,
  m: number,
  disabledFn: DisabledSecondsFn | undefined,
  target: number,
): number | undefined {
  const disabled = buildDisabledSet({
    options,
    minBoundary: { match: h === bounds.minT?.hour() && m === bounds.minT?.minute(), value: bounds.minT?.second() ?? 0 },
    maxBoundary: { match: h === bounds.maxT?.hour() && m === bounds.maxT?.minute(), value: bounds.maxT?.second() ?? 59 },
    disabledFn: disabledFn ? () => disabledFn(h, m) : undefined,
  });
  return findClosest(options, disabled, target);
}

export interface FindNearestTimeParams {
  hourOptions: DatePickerColumnOption[];
  minuteOptions: DatePickerColumnOption[];
  secondOptions: DatePickerColumnOption[];
  minTime?: string;
  maxTime?: string;
  disabledHours?: DisabledHoursFn;
  disabledMinutes?: DisabledMinutesFn;
  disabledSeconds?: DisabledSecondsFn;
  target: { hour: number; minute: number; second: number };
  format: string;
}

export function findNearestTime(params: FindNearestTimeParams): string | undefined {
  const { hourOptions, minuteOptions, secondOptions, format, target } = params;
  const bounds: TimeBounds = {
    minT: params.minTime ? dayjs(TIME_PREFIX + params.minTime) : null,
    maxT: params.maxTime ? dayjs(TIME_PREFIX + params.maxTime) : null,
  };

  const h = resolveHour(hourOptions, bounds, params.disabledHours, target.hour);
  if (h === undefined) return undefined;

  const mTarget = h === target.hour ? target.minute : 0;
  const m = resolveMinute(minuteOptions, bounds, h, params.disabledMinutes, mTarget);
  if (m === undefined) return undefined;

  const sTarget = h === target.hour && m === target.minute ? target.second : 0;
  const s = resolveSecond(secondOptions, bounds, h, m, params.disabledSeconds, sTarget) ?? 0;

  return dayjs(`1970-01-01 ${pad(h)}:${pad(m)}:${pad(s)}`).format(format);
}
