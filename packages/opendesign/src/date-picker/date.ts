import { isNull, isValidDate } from '../_utils/is';
import { getWeeksByDate, startOfMonth } from '../_utils/date';

export const WEEK_DAYS = 7;
export const MINUTE_TIME = 60 * 1000;
export const HOUR_TIME = 60 * MINUTE_TIME;
export const DAY_TIME = 24 * HOUR_TIME;
export const WEEK_TIME = WEEK_DAYS * DAY_TIME;
export interface DateT {
  date: Date;
  years?: number;
  months?: number;
  dayOfweek?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}
export interface DateRangeT {
  start: DateT;
  end: DateT;
}

export function normalizeDateValue(
  value: string | Date | number | undefined,
  parseFn: (v: string) => Date | null
): { type: 'string' | 'number' | 'Date'; value: Date | null } {
  if (typeof value === 'string') {
    try {
      return {
        type: 'string',
        value: value ? parseFn(value) : null,
      };
    } catch {
      return {
        type: 'string',
        value: null,
      };
    }
  }
  if (typeof value === 'number') {
    return {
      type: 'number',
      value: new Date(value),
    };
  }
  if (value instanceof Date) {
    return {
      type: 'Date',
      value: value,
    };
  }

  const d = value ? new Date(value) : null;
  return {
    type: 'Date',
    value: d && isValidDate(d) ? d : null,
  };
}

export function getRealDateValue(value: Date | null, type: 'string' | 'number' | 'Date', formatFn: (d: Date) => string): string | number | Date {
  if (isNull(value)) {
    return '';
  }
  if (type === 'string') {
    return formatFn(value);
  }
  if (type === 'number') {
    return value.getTime();
  }
  if (type === 'Date') {
    return value;
  }
  return '';
}

export const Labels = {
  weeks: ['日', '一', '二', '三', '四', '五', '六'],
  year: '年',
  month: '月',
  day: '日',
  today: '今天',
  confirm: '确定',
};
const DateTypes = ['years', 'months', 'dayOfweek', 'days', 'hours', 'minutes', 'seconds'] as const;
type DateKeyT = (typeof DateTypes)[number];

export const DateFormatString = {
  date: 'yyyy-MM-dd',
  year: 'yyyy',
  dateTime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
};

export function getMonthLabel(date: DateT) {
  let label = [];

  if (date.years) {
    label.push(date.years + Labels.year);
    if (date.months) {
      label.push(date.months + Labels.month);
    }
  }
  return label.join(' ');
}

const dateKeyFn: Record<DateKeyT, (d: Date) => number> = {
  years: (d: Date) => d.getFullYear(),
  months: (d: Date) => d.getMonth() + 1,
  dayOfweek: (d: Date) => d.getDay(),
  days: (d: Date) => d.getDate(),
  hours: (d: Date) => d.getHours(),
  minutes: (d: Date) => d.getMinutes(),
  seconds: (d: Date) => d.getSeconds(),
};
// TODO 完善该函数类型定义
export function getDate(date: Date, type: string = 'years|months|days|hours|minutes|seconds'): DateT {
  const rlt: DateT = {
    date: date,
  };

  const keys = type.split('|');

  keys.forEach((key) => {
    const k = key as DateKeyT;
    if (dateKeyFn[k]) {
      rlt[k] = dateKeyFn[k](date);
    }
  });

  return rlt;
}

export function getDaysofMonth(date: Date, weekLength: number = 6): DateT[] {
  // 获取该月第一天
  const mDate = startOfMonth(date);
  // 以该月第一周开始，获取weekLength周的日期列表

  let dayList = getWeeksByDate(mDate, weekLength, { parse: getDate });

  return dayList;
}

export function isSameYear(date1: DateT, date2: DateT): boolean {
  return date1.years === date2.years;
}
export function isSameMonth(date1: DateT, date2: DateT): boolean {
  return date1.years === date2.years && date1.months === date2.months;
}
export function isSameDay(date1: DateT, date2: DateT): boolean {
  return date1.years === date2.years && date1.months === date2.months && date1.days === date2.days;
}

/**
 * 获取日期在范围内的状态
 * @param date
 * @param range
 * @returns {in: boolean, start: boolean, end: boolean}
 */
export function getDateRangeStatus(date: DateT, range: DateRangeT) {
  const { start, end } = range;

  const dt = date.date.getTime();
  const st = range.start.date.getTime();
  const et = range.end.date.getTime();

  return {
    in: dt >= st && dt <= et,
    start: isSameDay(date, start),
    end: isSameDay(date, end),
  };
}
