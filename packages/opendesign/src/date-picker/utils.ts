import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { isNil } from '../_utils/is.ts';
import { DateModelValue, DisabledMonthFn, DisabledYearFn } from './types';

export interface RangeStateResult {
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

interface ComputeRangeStateParams {
  /** 当前格子的日期 */
  cell: Dayjs;
  /** 比较粒度（'day' | 'month' | 'year'） */
  unit: string;
  /** 已确认范围的起始日期（排序后） */
  rangeStart: Dayjs | null;
  /** 已确认范围的结束日期（排序后） */
  rangeEnd: Dayjs | null;
  /** 第一次点击的锚点日期（选择进行中时有值） */
  anchorDate: Dayjs | null;
  /** 鼠标悬停的日期（用于范围选择的实时预览） */
  hoverDate: Dayjs | null;
}

/**
 * 根据范围选择状态计算单个格子的范围高亮标记
 * @param cell - 当前格子的日期
 * @param unit - 比较粒度
 * @param rangeStart - 已确认范围起始
 * @param rangeEnd - 已确认范围结束
 * @param anchorDate - 选择进行中的锚点
 * @param hoverDate - 当前悬停日期
 * @returns 范围高亮状态
 */
export function computeRangeState({ cell, unit, rangeStart, rangeEnd, anchorDate, hoverDate }: ComputeRangeStateParams): RangeStateResult {
  if (rangeStart && rangeEnd) {
    return {
      isRangeStart: cell.isSame(rangeStart, unit as any),
      isRangeEnd: cell.isSame(rangeEnd, unit as any),
      isInRange: cell.isAfter(rangeStart, unit as any) && cell.isBefore(rangeEnd, unit as any),
    };
  }
  if (anchorDate) {
    if (hoverDate) {
      const [effStart, effEnd] = hoverDate.isBefore(anchorDate, unit as any) ? [hoverDate, anchorDate] : [anchorDate, hoverDate];
      return {
        isRangeStart: cell.isSame(effStart, unit as any),
        isRangeEnd: cell.isSame(effEnd, unit as any),
        isInRange: cell.isAfter(effStart, unit as any) && cell.isBefore(effEnd, unit as any),
      };
    }
    return { isRangeStart: cell.isSame(anchorDate, unit as any), isRangeEnd: false, isInRange: false };
  }
  return { isRangeStart: false, isRangeEnd: false, isInRange: false };
}

dayjs.extend(customParseFormat);

/** year view 下面板导航每次跳跃的年数，同时也是双面板右侧偏移量 */
export const YEAR_VIEW_STEP = 10;

/**
 * Parse a user-provided model value into a Dayjs object.
 * Accepts: Date object, formatted string, number timestamp, or ISO string.
 */
export function parseValue(value: DateModelValue): Dayjs | null {
  if (isNil(value) || value === '') return null;
  if (typeof value === 'number' || value instanceof Date) {
    const _d = dayjs(value);
    return _d.isValid() ? _d : null;
  }

  // formatted string
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

export function isMonthDisabled(
  year: number,
  month: number, // 0-indexed，0=一月，11=十二月
  options: {
    disabledDate?: (d: Date) => boolean;
    disabledMonth?: DisabledMonthFn;
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
  },
): boolean {
  const { disabledMonth, minDate, maxDate } = options;
  const d = dayjs().year(year).month(month);
  if (minDate && d.endOf('month').isBefore(minDate, 'day')) return true;
  if (maxDate && d.startOf('month').isAfter(maxDate, 'day')) return true;
  if (disabledMonth && disabledMonth({ date: d.toDate(), year, month })) return true;
  return false;
}

export function isYearDisabled(
  year: number,
  options: {
    disabledYear?: DisabledYearFn;
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
  },
): boolean {
  const { disabledYear, minDate, maxDate } = options;
  if (minDate && year < minDate.year()) return true;
  if (maxDate && year > maxDate.year()) return true;
  if (disabledYear && disabledYear({ date: dayjs().year(year).toDate(), year })) return true;
  return false;
}
