import { startOfMonth, addYears, subYears, addMonths, subMonths, format as formatDate, parse as parseDate } from 'date-fns';

export const WEEK_DAYS = 7;
export const MINUTE_TIME = 60 * 1000;
export const HOUR_TIME = 60 * MINUTE_TIME;
export const DAY_TIME = 24 * HOUR_TIME;
export const WEEK_TIME = WEEK_DAYS * DAY_TIME;

/**
 * 根据传入日期获取连续几周的日期
 * @param date 传入日期
 * @param length 周数量
 * @param param {
 *  weekStartsOn: 0|1|2|3|4|5|6  0代表星期日
 * }
 */
export function getWeeksByDate<T = Date>(
  date: Date,
  length: number = 1,
  {
    weekStartsOn = 0,
    parse = (d: Date) => d as T,
  }: {
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    parse?: (d: Date) => T;
  } = {}
): Array<T> {
  const time = date.getTime();
  const day = date.getDay();

  const weeks: Array<T> = [];
  const dis = (weekStartsOn % WEEK_DAYS) - day;
  const first = time + DAY_TIME * dis;

  for (let i = 0; i < WEEK_DAYS * length; i++) {
    if (i === dis) {
      weeks.push(parse(date));
    } else {
      const d = new Date(first + DAY_TIME * i);
      weeks.push(parse(d));
    }
  }

  return weeks;
}

export { startOfMonth, addYears, subYears, addMonths, subMonths, formatDate, parseDate };

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}
