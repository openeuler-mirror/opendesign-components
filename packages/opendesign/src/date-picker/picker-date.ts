import { isUndefined, isFunction, isNumber, isValidDate } from '../_utils/is';

interface DateT {
  year?: number;
  month?: number;
  dayOfweek?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export class PickerDate {
  private _cache: DateT;
  private _date: Date;
  private _onChange?: (d: PickerDate) => void;
  constructor(date?: string | number | Date | null, onChange?: (d: PickerDate) => void) {
    if (!date) {
      this._date = new Date(NaN);
    } else {
      this._date = new Date(date);
    }
    this._cache = {};
    this._onChange = onChange;
  }

  set(value: { year?: number; month?: number; day?: number; hour?: number; minute?: number; second?: number }) {
    const { year = this.year, month = this.month, day = this.day, hour = this.hour, minute = this.minute, second = this.second } = value;

    const now = new Date();
    const y = !isNumber(year) ? now.getFullYear() : year;
    const m = !isNumber(month) ? now.getMonth() : month;
    const d = !isNumber(day) ? now.getDate() : day;

    const h = !isNumber(hour) ? now.getHours() : hour;
    const mt = !isNumber(minute) ? now.getMinutes() : minute;
    const s = !isNumber(second) ? now.getSeconds() : second;

    const last = this._date.getTime();
    this._date = new Date(y, m, d, h, mt, s);

    if (last !== this._date.getTime()) {
      this._cache = {};

      if (isFunction(this._onChange)) {
        this._onChange(this);
      }
    }
    return this;
  }

  get valid(): Boolean {
    return isValidDate(this._date);
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date | null) {
    const last = this._date.getTime();
    this._date = date ?? new Date(NaN);

    if (last !== this._date.getTime()) {
      this._cache = {};

      if (isFunction(this._onChange)) {
        this._onChange(this);
      }
    }
  }

  // year
  get year(): number {
    if (isUndefined(this._cache.year)) {
      this._cache.year = this._date.getFullYear();
    }
    return this._cache.year;
  }
  set year(value: number) {
    this.set({ year: value });
  }

  // month
  get month(): number {
    if (isUndefined(this._cache.month)) {
      const m = this._date.getMonth();
      this._cache.month = m;
    }
    return this._cache.month;
  }
  set month(value: number) {
    this.set({ month: value });
  }

  // day
  get day(): number {
    if (isUndefined(this._cache.day)) {
      this._cache.day = this._date.getDate();
    }
    return this._cache.day;
  }
  set day(value: number) {
    this.set({ day: value });
  }

  // hour
  get hour(): number {
    if (isUndefined(this._cache.hour)) {
      this._cache.hour = this._date.getHours();
    }
    return this._cache.hour;
  }
  set hour(value: number) {
    this.set({ hour: value });
  }

  // minute
  get minute(): number {
    if (isUndefined(this._cache.minute)) {
      this._cache.minute = this._date.getMinutes();
    }
    return this._cache.minute;
  }
  set minute(value: number) {
    this.set({ minute: value });
  }

  // second
  get second(): number {
    if (isUndefined(this._cache.second)) {
      this._cache.second = this._date.getSeconds();
    }
    return this._cache.second;
  }
  set second(value: number) {
    this.set({ second: value });
  }
}
