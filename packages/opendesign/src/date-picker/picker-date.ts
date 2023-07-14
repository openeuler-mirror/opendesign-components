import { isNumber } from '../_utils/is';
import { isUndefined } from '../_utils/is';

interface DateT {
  years?: number;
  months?: number;
  dayOfweek?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export class PickerDate {
  private _cache: DateT;
  private _date: Date;
  constructor(date: string | number | Date | null) {
    if (!date) {
      this._date = new Date(NaN);
    } else {
      this._date = new Date(date);
    }

    this._cache = {};
  }

  set(value: { years?: number; months?: number; days?: number; hours?: number; minutes?: number; seconds?: number }) {
    const { years = this.years, months = this.months, days = this.days, hours = this.hours, minutes = this.minutes, seconds = this.seconds } = value;

    const now = new Date();
    const y = !isNumber(years) ? now.getFullYear() : years;
    const m = !isNumber(months) ? now.getMonth() : months - 1;
    const d = !isNumber(days) ? now.getDate() : days;

    const h = !isNumber(hours) ? now.getHours() : hours;
    const mt = !isNumber(minutes) ? now.getMinutes() : minutes;
    const s = !isNumber(seconds) ? now.getSeconds() : seconds;

    this._date = new Date(y, m, d, h, mt, s);
    this._cache = {};
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date | null) {
    this._date = date ?? new Date(NaN);
    this._cache = {};
  }

  // years
  get years(): number {
    if (isUndefined(this._cache.years)) {
      this._cache.years = this._date.getFullYear();
    }
    return this._cache.years;
  }
  set years(value: number) {
    this.set({ years: value });
  }

  // months
  get months(): number {
    if (isUndefined(this._cache.months)) {
      const m = this._date.getMonth();
      this._cache.months = m + 1;
    }
    return this._cache.months;
  }
  set months(value: number) {
    this.set({ months: value });
  }

  // days
  get days(): number {
    if (isUndefined(this._cache.days)) {
      this._cache.days = this._date.getDate();
    }
    return this._cache.days;
  }
  set days(value: number) {
    this.set({ days: value });
  }

  // hours
  get hours(): number {
    if (isUndefined(this._cache.hours)) {
      this._cache.hours = this._date.getHours();
    }
    return this._cache.hours;
  }
  set hours(value: number) {
    this.set({ hours: value });
  }

  // minutes
  get minutes(): number {
    if (isUndefined(this._cache.minutes)) {
      this._cache.minutes = this._date.getMinutes();
    }
    return this._cache.minutes;
  }
  set minutes(value: number) {
    this.set({ minutes: value });
  }

  // seconds
  get seconds(): number {
    if (isUndefined(this._cache.seconds)) {
      this._cache.seconds = this._date.getSeconds();
    }
    return this._cache.seconds;
  }
  set seconds(value: number) {
    this.set({ seconds: value });
  }
}
