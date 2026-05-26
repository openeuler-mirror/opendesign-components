import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { isNil } from '../_utils/is.ts';
import { DateModelValue, DisabledMonthFn, DisabledYearFn } from './types';

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
