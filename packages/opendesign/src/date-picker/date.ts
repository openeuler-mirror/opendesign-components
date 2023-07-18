import { isNull } from '../_utils/is';
import { getWeeksByDate, startOfMonth } from '../_utils/date';
import { PickerDate } from './picker-date';
import { PickerModeT } from './types';
import { OScroller } from '../scroller';

export const WEEK_DAYS = 7;
export const MINUTE_TIME = 60 * 1000;
export const HOUR_TIME = 60 * MINUTE_TIME;
export const DAY_TIME = 24 * HOUR_TIME;
export const WEEK_TIME = WEEK_DAYS * DAY_TIME;

export interface DateRangeT {
  start: PickerDate;
  end: PickerDate;
}

export const Labels = {
  weeks: ['日', '一', '二', '三', '四', '五', '六'],
  year: '年',
  month: '月',
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  day: '日',
  now: '此刻',
  confirm: '确定',
};

export function getYearLabel(value: number): string {
  return `${value}${Labels.year}`;
}

export function getMonthLabel(value: number): string {
  return `${value}${Labels.month}`;
}

export function getDayLabel(value: number): string {
  return `${value}${Labels.day}`;
}

export const DefaultFormatString = {
  date: 'yyyy-MM-dd',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
};

/**
 * 根据formatString决定type
 * @param formatString
 */
export function getPickerType(formatString: string): PickerModeT {
  // const y = formatString.includes('y');
  // const m = formatString.includes('M');
  const d = formatString.includes('d');
  if (d) {
    return 'date';
  }
  return 'date';
}

export function normalizeDateValue(
  value: string | Date | number | undefined,
  parseFn: (v: string) => Date
): { type: 'string' | 'number' | 'Date'; value: Date } {
  if (typeof value === 'string') {
    try {
      return {
        type: 'string',
        value: parseFn(value),
      };
    } catch {
      return {
        type: 'string',
        value: new Date(NaN),
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

  const d = new Date(value || NaN);
  return {
    type: 'Date',
    value: d,
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

export function getDaysofMonth(date: Date | null, weekLength: number = 6): PickerDate[] {
  // 获取该月第一天
  const mDate = startOfMonth(date ?? new Date());
  // 以该月第一周开始，获取weekLength周的日期列表

  let dayList = getWeeksByDate(mDate, weekLength, { parse: (d: Date | null) => new PickerDate(d) });

  return dayList;
}

export function isSameYear(date1: { years?: number }, date2: { years?: number }): boolean {
  return date1.years === date2.years;
}
export function isSameMonth(date1: { years?: number; months?: number }, date2: { years?: number; months?: number }): boolean {
  return date1.years === date2.years && date1.months === date2.months;
}
export function isSameDay(date1: { years?: number; months?: number; days?: number }, date2: { years?: number; months?: number; days?: number }): boolean {
  return date1.years === date2.years && date1.months === date2.months && date1.days === date2.days;
}

/**
 * 获取日期在范围内的状态
 * @param date
 * @param range
 * @returns {in: boolean, start: boolean, end: boolean}
 */
export function getDateRangeStatus(date: PickerDate, range: DateRangeT) {
  const { start, end } = range;

  const dt = date.date?.getTime();
  const st = range.start.date?.getTime();
  const et = range.end.date?.getTime();

  return {
    in: dt >= st && dt <= et,
    start: isSameDay(date, start),
    end: isSameDay(date, end),
  };
}

export function scrollCellToView(
  scroller: InstanceType<typeof OScroller> | undefined,
  selector: string,
  {
    smooth,
    align,
  }: {
    smooth?: boolean;
    align?: 'center' | 'top' | 'bottom';
  } = {
    smooth: true,
    align: 'top',
  }
): void {
  if (!scroller) {
    return;
  }

  const el = scroller?.$el.querySelector(selector);
  if (!el || !scroller.containerRef) {
    return;
  }
  const { offsetTop, clientHeight } = el;
  const { clientHeight: outHeight } = scroller.containerRef;

  let top = offsetTop;
  if (align === 'center') {
    top = offsetTop - outHeight / 2 + clientHeight / 2;
  } else if (align === 'bottom') {
    top = offsetTop - outHeight + clientHeight;
  }
  scroller.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto',
  });
}
