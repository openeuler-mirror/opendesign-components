import { computed, MaybeRefOrGetter, Ref, toValue } from 'vue';

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

type ParsedTimeValue = { hour: number; minute: number; second: number };

interface TimeUnitBounds {
  /** 边界下限（null 表示无下限） */
  min: number | null;
  /** 边界上限（null 表示无上限） */
  max: number | null;
}

interface ComputeDisabledUnitParams {
  /** 单位选项列表 */
  options: DatePickerColumnOption[];
  /** 边界限制 */
  bounds: TimeUnitBounds;
  /** 自定义禁用值列表 */
  customDisabled: number[];
}

/**
 * 生成时间步进选项列表
 * @param limit - 上限（不含），如 24 或 60
 * @param step - 步长
 * @returns 格式化后的选项列表
 */
function buildTimeStepOptions(limit: number, step: number): DatePickerColumnOption[] {
  const list: DatePickerColumnOption[] = [];
  for (let i = 0; i < limit; i += step) {
    list.push({ label: pad(i), value: i });
  }
  return list;
}

/**
 * 将时间字符串解析为 {hour, minute, second}，失败或无输入时返回 null
 * @param time - 时间字符串（如 "09:30:00"）
 * @returns 解析结果，无效时返回 null
 */
function parseTimeBound(time: string | undefined): ParsedTimeValue | null {
  if (!time) return null;
  const parsed = stringToDateTimeNumber(time, { timeOnly: true });
  if (!parsed || parsed.hour === null || parsed.minute === null || parsed.second === null) return null;
  return parsed as ParsedTimeValue;
}

/**
 * 将超出边界范围的选项值加入禁用集合
 * @param disabled - 禁用值集合（原地修改）
 * @param options - 可选选项列表
 * @param bounds - 边界下限/上限
 */
function addBoundaryDisabled(disabled: Set<number>, options: DatePickerColumnOption[], bounds: TimeUnitBounds): void {
  for (const opt of options) {
    if (bounds.min !== null && opt.value < bounds.min) disabled.add(opt.value);
    if (bounds.max !== null && opt.value > bounds.max) disabled.add(opt.value);
  }
}

/**
 * 将自定义禁用值（仅已在选项列表中存在的值）加入禁用集合
 * @param disabled - 禁用值集合（原地修改）
 * @param options - 可选选项列表
 * @param customValues - 自定义禁用值列表
 */
function addCustomDisabled(disabled: Set<number>, options: DatePickerColumnOption[], customValues: number[]): void {
  const validValues = new Set(options.map((o) => o.value));
  for (const v of customValues) {
    if (validValues.has(v)) disabled.add(v);
  }
}

/**
 * 根据边界和自定义禁用列表计算禁用的时间单位值
 * @param options - 单位选项列表
 * @param bounds - 边界下限/上限
 * @param customDisabled - 自定义禁用值列表
 * @returns 禁用值数组
 */
function computeDisabledUnit({ options, bounds, customDisabled }: ComputeDisabledUnitParams): number[] {
  const disabled = new Set<number>();
  addBoundaryDisabled(disabled, options, bounds);
  addCustomDisabled(disabled, options, customDisabled);
  return [...disabled];
}

/**
 * 计算分钟维度的有效边界（仅在选中小时匹配 min/max 小时时生效）
 * @param hour - 当前选中小时
 * @param min - 解析后的最小时间
 * @param max - 解析后的最大时间
 * @returns 有效的分钟边界
 */
function resolveMinuteBounds(hour: number, min: ParsedTimeValue | null, max: ParsedTimeValue | null): TimeUnitBounds {
  const atMin = min !== null && hour === min.hour;
  const atMax = max !== null && hour === max.hour;
  return { min: atMin ? min!.minute : null, max: atMax ? max!.minute : null };
}

interface ResolveSecondBoundsParams {
  /** 当前选中小时 */
  hour: number;
  /** 当前选中分钟 */
  minute: number;
  /** 解析后的最小时间 */
  min: ParsedTimeValue | null;
  /** 解析后的最大时间 */
  max: ParsedTimeValue | null;
}

/**
 * 计算秒维度的有效边界（仅在选中小时和分钟均匹配 min/max 时生效）
 * @param hour - 当前选中小时
 * @param minute - 当前选中分钟
 * @param min - 解析后的最小时间
 * @param max - 解析后的最大时间
 * @returns 有效的秒边界
 */
function resolveSecondBounds({ hour, minute, min, max }: ResolveSecondBoundsParams): TimeUnitBounds {
  const atMin = min !== null && hour === min.hour && minute === min.minute;
  const atMax = max !== null && hour === max.hour && minute === max.minute;
  return { min: atMin ? min!.second : null, max: atMax ? max!.second : null };
}

/** 管理时间步进选项（hour/minute/second 的可选列表） */
function useTimeStepOptions(
  hourStep: MaybeRefOrGetter<number | undefined>,
  minuteStep: MaybeRefOrGetter<number | undefined>,
  secondStep: MaybeRefOrGetter<number | undefined>,
) {
  const hourOptions = computed<DatePickerColumnOption[]>(() => buildTimeStepOptions(24, toValue(hourStep) || 1));
  const minuteOptions = computed<DatePickerColumnOption[]>(() => buildTimeStepOptions(60, toValue(minuteStep) || 1));
  const secondOptions = computed<DatePickerColumnOption[]>(() => buildTimeStepOptions(60, toValue(secondStep) || 1));
  return { hourOptions, minuteOptions, secondOptions };
}

interface UseTimeDisabledOptionsParams {
  /** 小时选项 */
  hourOptions: Ref<DatePickerColumnOption[]>;
  /** 分钟选项 */
  minuteOptions: Ref<DatePickerColumnOption[]>;
  /** 秒选项 */
  secondOptions: Ref<DatePickerColumnOption[]>;
  /** 解析后的最小时间 */
  parsedMinTime: Ref<ParsedTimeValue | null>;
  /** 解析后的最大时间 */
  parsedMaxTime: Ref<ParsedTimeValue | null>;
  /** 自定义禁用小时函数 */
  disabledHours?: MaybeRefOrGetter<DisabledHoursFn | undefined>;
  /** 自定义禁用分钟函数 */
  disabledMinutes?: MaybeRefOrGetter<DisabledMinutesFn | undefined>;
  /** 自定义禁用秒函数 */
  disabledSeconds?: MaybeRefOrGetter<DisabledSecondsFn | undefined>;
  /** 当前选中小时 */
  selectedHour: MaybeRefOrGetter<number | null>;
  /** 当前选中分钟 */
  selectedMinute: MaybeRefOrGetter<number | null>;
}

/** 管理禁用时间单位选项（依赖步进选项和已解析的边界时间） */
function useTimeDisabledOptions({
  hourOptions,
  minuteOptions,
  secondOptions,
  parsedMinTime,
  parsedMaxTime,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  selectedHour,
  selectedMinute,
}: UseTimeDisabledOptionsParams) {
  const disabledHourOptions = computed<number[]>(() => {
    const min = parsedMinTime.value;
    const max = parsedMaxTime.value;
    return computeDisabledUnit({
      options: hourOptions.value,
      bounds: { min: min ? min.hour : null, max: max ? max.hour : null },
      customDisabled: toValue(disabledHours)?.() ?? [],
    });
  });

  const disabledMinuteOptions = computed<number[]>(() => {
    const hour = toValue(selectedHour);
    if (hour === null) return [];
    return computeDisabledUnit({
      options: minuteOptions.value,
      bounds: resolveMinuteBounds(hour, parsedMinTime.value, parsedMaxTime.value),
      customDisabled: toValue(disabledMinutes)?.(hour) ?? [],
    });
  });

  const disabledSecondOptions = computed<number[]>(() => {
    const hour = toValue(selectedHour);
    const minute = toValue(selectedMinute);
    if (hour === null || minute === null) return [];
    return computeDisabledUnit({
      options: secondOptions.value,
      bounds: resolveSecondBounds({ hour, minute, min: parsedMinTime.value, max: parsedMaxTime.value }),
      customDisabled: toValue(disabledSeconds)?.(hour, minute) ?? [],
    });
  });

  return { disabledHourOptions, disabledMinuteOptions, disabledSecondOptions };
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
  const parsedMinTime = computed(() => parseTimeBound(toValue(minTime)));
  const parsedMaxTime = computed(() => parseTimeBound(toValue(maxTime)));
  const { hourOptions, minuteOptions, secondOptions } = useTimeStepOptions(hourStep, minuteStep, secondStep);
  const { disabledHourOptions, disabledMinuteOptions, disabledSecondOptions } = useTimeDisabledOptions({
    hourOptions,
    minuteOptions,
    secondOptions,
    parsedMinTime,
    parsedMaxTime,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    selectedHour,
    selectedMinute,
  });
  return { hourOptions, minuteOptions, secondOptions, disabledHourOptions, disabledMinuteOptions, disabledSecondOptions };
};
