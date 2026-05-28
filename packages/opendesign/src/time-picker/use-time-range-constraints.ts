import { computed, MaybeRefOrGetter, toValue } from 'vue';
import dayjs from 'dayjs';

import { TIME_PREFIX } from './types';

type TimeUnit = 'second' | 'minute' | 'hour';

/** 判断时间字符串 a 是否严格早于 b，兼容 HH:mm 与 HH:mm:ss 混用 */
export const isTimeBefore = (a: string, b: string) => dayjs(TIME_PREFIX + a).isBefore(dayjs(TIME_PREFIX + b));

/** 判断时间字符串 a 是否严格晚于 b，兼容 HH:mm 与 HH:mm:ss 混用 */
export const isTimeAfter = (a: string, b: string) => dayjs(TIME_PREFIX + a).isAfter(dayjs(TIME_PREFIX + b));

/**
 * 根据 format 和步长计算时间范围选择器的双端约束：
 * - maxStartTime：开始时间的上限（结束时间 - 1 步长）
 * - minEndTime：结束时间的下限（开始时间 + 1 步长）
 *
 * 可通过 enabled 参数按条件启用，disabled 时两个约束均返回 undefined（如日期范围不同天时无需约束）。
 */
export function useTimeRangeConstraints(params: {
  startTime: MaybeRefOrGetter<string | undefined>;
  endTime: MaybeRefOrGetter<string | undefined>;
  format: MaybeRefOrGetter<string | undefined>;
  hourStep: MaybeRefOrGetter<number | undefined>;
  minuteStep: MaybeRefOrGetter<number | undefined>;
  secondStep: MaybeRefOrGetter<number | undefined>;
  /** 约束是否生效，不传则始终生效 */
  enabled?: MaybeRefOrGetter<boolean>;
}) {
  const { startTime, endTime, format, hourStep, minuteStep, secondStep, enabled } = params;

  const smallestUnit = computed<TimeUnit>(() => {
    const fmt = toValue(format)?.toLowerCase() ?? 'hh:mm:ss';
    if (fmt.includes('ss')) return 'second';
    if (fmt.includes('mm')) return 'minute';
    return 'hour';
  });

  const smallestStep = computed(
    () =>
      ({
        second: toValue(secondStep) ?? 1,
        minute: toValue(minuteStep) ?? 1,
        hour: toValue(hourStep) ?? 1,
      })[smallestUnit.value],
  );

  const maxStartTime = computed(() => {
    if (enabled !== undefined && !toValue(enabled)) return undefined;
    const end = toValue(endTime);
    if (!end) return undefined;
    return dayjs(TIME_PREFIX + end)
      .subtract(smallestStep.value, smallestUnit.value)
      .format('HH:mm:ss');
  });

  const minEndTime = computed(() => {
    if (enabled !== undefined && !toValue(enabled)) return undefined;
    const start = toValue(startTime);
    if (!start) return undefined;
    return dayjs(TIME_PREFIX + start)
      .add(smallestStep.value, smallestUnit.value)
      .format('HH:mm:ss');
  });

  return { maxStartTime, minEndTime };
}
