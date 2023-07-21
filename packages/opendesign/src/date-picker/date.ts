import { isNull } from '../_utils/is';
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
  year: 'yyyy',
  month: 'yyyy-MM',
  monthOnly: 'MM',
  date: 'yyyy-MM-dd',
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

export function isSameYear(date1: { year?: number }, date2: { year?: number }): boolean {
  return date1.year === date2.year;
}
export function isSameMonth(date1: { year?: number; month?: number }, date2: { year?: number; month?: number }): boolean {
  return date1.year === date2.year && date1.month === date2.month;
}
export function isSameDay(date1: { year?: number; month?: number; day?: number }, date2: { year?: number; month?: number; day?: number }): boolean {
  return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
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

export function scrollSelectOrNowCellInToView(
  scroller: InstanceType<typeof OScroller> | undefined,
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

  let el = scroller?.$el.querySelector('.o-picker-cell-selected');
  if (!el) {
    el = scroller?.$el.querySelector('.o-picker-cell-now');
  }
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

/**
 * 获取连续数字
 * @param start
 * @param length
 * @param handler
 */
export function getNumberList<T>(start: number, length: number, handler: (v: number) => T): T[] {
  const rlt = [];
  for (let i = start; i < length; i++) {
    rlt.push(handler(i));
  }
  return rlt;
}

export function formatTime(date: PickerDate, formatString: string = 'HH:mm:ss'): string {
  const h = date.hour ? '0' : date.hour.toString();
  const m = date.minute ? '0' : date.minute.toString();
  const s = date.second ? '0' : date.second.toString();
  return formatString
    .replace('HH', h.padStart(2, '0'))
    .replace('mm', m.padStart(2, '0'))
    .replace('ss', s.padStart(2, '0'))
    .replace('H', h)
    .replace('m', m)
    .replace('s', s);
}
