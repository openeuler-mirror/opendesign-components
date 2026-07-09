import dayjs from 'dayjs';

import { isNil } from './is';

/**
 * 时间前补零
 */
export const pad = (n: number, maxLength = 2) => String(n).padStart(maxLength, '0');

/**
 * 格式化时间为字符串，入参month为自然语义月，从1开始
 * 如果不需要年月日时，自动补全年月日到1970-1-1
 */
export const dateTimeNumberToString = (
  { year, month, date, hour, minute, second }: Partial<Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', number | null>>,
  {
    format,
    timeOnly = false,
  }: {
    /**
     * dayjs支持的format
     * @example YYYY-MM-DD HH:mm:ss
     */
    format: string;
    /**
     * 是否需要年月日信息
     */
    timeOnly?: boolean;
  },
): string | undefined => {
  const toValidate = timeOnly ? [hour, minute, second] : [year, month, date, hour, minute, second];
  if (toValidate.some((v) => isNil(v))) {
    return undefined;
  }
  const dayjsDate = dayjs(`${isNil(year) ? 1970 : year}-${isNil(month) ? 1 : month}-${isNil(date) ? 1 : date} ${hour}:${minute}:${second}`);
  return dayjsDate.isValid() ? dayjsDate.format(format) : undefined;
};

/**
 * 解析时间字符串为自然语义数字，month从1开始，自动处理超边界
 */
export function stringToDateTimeNumber(
  str: string | null | undefined,
  options?: { timeOnly: true },
): Record<'hour' | 'minute' | 'second', number | null> | undefined;
export function stringToDateTimeNumber(
  str: string | null | undefined,
  options?: { timeOnly?: false | undefined },
): Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', number | null> | undefined;
export function stringToDateTimeNumber(
  str: string | null | undefined,
  {
    timeOnly,
  }: {
    /**
     * 是否需要年月日信息
     */
    timeOnly?: boolean;
  } = {},
): Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', number | null> | Record<'hour' | 'minute' | 'second', number | null> | undefined {
  if (isNil(str)) {
    return undefined;
  }
  const dayjsDate = dayjs(timeOnly && !str.includes(' ') ? `1970-1-1 ${str}` : str);
  const dateInfo = {
    year: isNaN(dayjsDate.get('year')) ? null : dayjsDate.get('year'),
    month: isNaN(dayjsDate.get('month')) ? null : dayjsDate.get('month') + 1,
    date: isNaN(dayjsDate.get('date')) ? null : dayjsDate.get('date'),
  };
  const timeInfo = {
    hour: isNaN(dayjsDate.get('hour')) ? null : dayjsDate.get('hour'),
    minute: isNaN(dayjsDate.get('minute')) ? null : dayjsDate.get('minute'),
    second: isNaN(dayjsDate.get('second')) ? null : dayjsDate.get('second'),
  };

  return timeOnly
    ? timeInfo
    : {
        ...dateInfo,
        ...timeInfo,
      };
}
