import dayjs from 'dayjs';

import { pad } from '../_utils/time.ts';

import { DatePickerColumnOption, DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn, TIME_PREFIX } from './types.ts';

interface BoundaryParams {
  options: DatePickerColumnOption[];
  minBoundary?: { match: boolean; value: number };
  maxBoundary?: { match: boolean; value: number };
  disabledFn?: () => number[];
}

/**
 * 将自定义禁用函数返回的值加入禁用集合（仅已在选项中存在的值）
 * @param disabled - 禁用值集合（原地修改）
 * @param options - 可选选项列表
 * @param disabledFn - 自定义禁用值函数
 */
function addFnDisabled(disabled: Set<number>, options: DatePickerColumnOption[], disabledFn: (() => number[]) | undefined): void {
  if (!disabledFn) return;
  for (const v of disabledFn()) {
    if (options.some((opt) => opt.value === v)) disabled.add(v);
  }
}

function buildDisabledSet({ options, minBoundary, maxBoundary, disabledFn }: BoundaryParams): Set<number> {
  const disabled = new Set<number>();
  for (const opt of options) {
    if (minBoundary?.match && opt.value < minBoundary.value) disabled.add(opt.value);
    if (maxBoundary?.match && opt.value > maxBoundary.value) disabled.add(opt.value);
  }
  addFnDisabled(disabled, options, disabledFn);
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

interface ResolveHourParams {
  /** 小时选项列表 */
  options: DatePickerColumnOption[];
  /** 时间边界 */
  bounds: TimeBounds;
  /** 自定义禁用小时函数 */
  disabledFn?: DisabledHoursFn;
  /** 目标小时值 */
  target: number;
}

function resolveHour({ options, bounds, disabledFn, target }: ResolveHourParams): number | undefined {
  const disabled = buildDisabledSet({
    options,
    minBoundary: bounds.minT ? { match: true, value: bounds.minT.hour() } : undefined,
    maxBoundary: bounds.maxT ? { match: true, value: bounds.maxT.hour() } : undefined,
    disabledFn,
  });
  return findClosest(options, disabled, target);
}

interface ResolveMinuteParams {
  /** 分钟选项列表 */
  options: DatePickerColumnOption[];
  /** 时间边界 */
  bounds: TimeBounds;
  /** 已解析的小时值 */
  h: number;
  /** 自定义禁用分钟函数 */
  disabledFn?: DisabledMinutesFn;
  /** 目标分钟值 */
  target: number;
}

function resolveMinute({ options, bounds, h, disabledFn, target }: ResolveMinuteParams): number | undefined {
  const disabled = buildDisabledSet({
    options,
    minBoundary: { match: h === bounds.minT?.hour(), value: bounds.minT?.minute() ?? 0 },
    maxBoundary: { match: h === bounds.maxT?.hour(), value: bounds.maxT?.minute() ?? 59 },
    disabledFn: disabledFn ? () => disabledFn(h) : undefined,
  });
  return findClosest(options, disabled, target);
}

interface ResolveSecondParams {
  /** 秒选项列表 */
  options: DatePickerColumnOption[];
  /** 时间边界 */
  bounds: TimeBounds;
  /** 已解析的小时值 */
  h: number;
  /** 已解析的分钟值 */
  m: number;
  /** 自定义禁用秒函数 */
  disabledFn?: DisabledSecondsFn;
  /** 目标秒值 */
  target: number;
}

function resolveSecond({ options, bounds, h, m, disabledFn, target }: ResolveSecondParams): number | undefined {
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

  const h = resolveHour({ options: hourOptions, bounds, disabledFn: params.disabledHours, target: target.hour });
  if (h === undefined) return undefined;

  const mTarget = h === target.hour ? target.minute : 0;
  const m = resolveMinute({ options: minuteOptions, bounds, h, disabledFn: params.disabledMinutes, target: mTarget });
  if (m === undefined) return undefined;

  const sTarget = h === target.hour && m === target.minute ? target.second : 0;
  const s = resolveSecond({ options: secondOptions, bounds, h, m, disabledFn: params.disabledSeconds, target: sTarget }) ?? 0;

  return dayjs(`1970-01-01 ${pad(h)}:${pad(m)}:${pad(s)}`).format(format);
}
