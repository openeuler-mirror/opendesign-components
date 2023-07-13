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

    this._date = new Date(years || 0, !months && months !== 0 ? 0 : months - 1, days || 1, hours || 0, minutes || 0, seconds || 0);
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
  get years(): number | undefined {
    if (isUndefined(this._cache.years)) {
      this._cache.years = this._date.getFullYear();
    }
    return this._cache.years;
  }
  set years(value: number) {
    this.set({ years: value });
  }

  // months
  get months(): number | undefined {
    if (isUndefined(this._cache.months)) {
      const m = this._date.getMonth();
      this._cache.months = m === undefined ? undefined : m + 1;
    }
    return this._cache.months;
  }
  set months(value: number) {
    this.set({ months: value });
  }

  // days
  get days(): number | undefined {
    if (isUndefined(this._cache.days)) {
      this._cache.days = this._date.getDate();
    }
    return this._cache.days;
  }
  set days(value: number) {
    this.set({ days: value });
  }

  // hours
  get hours(): number | undefined {
    if (isUndefined(this._cache.hours)) {
      this._cache.hours = this._date.getHours();
    }
    return this._cache.hours;
  }
  set hours(value: number) {
    this.set({ hours: value });
  }

  // minutes
  get minutes(): number | undefined {
    if (isUndefined(this._cache.minutes)) {
      this._cache.minutes = this._date.getMinutes();
    }
    return this._cache.minutes;
  }
  set minutes(value: number) {
    this.set({ minutes: value });
  }

  // seconds
  get seconds(): number | undefined {
    if (isUndefined(this._cache.seconds)) {
      this._cache.seconds = this._date.getSeconds();
    }
    return this._cache.seconds;
  }
  set seconds(value: number) {
    this.set({ seconds: value });
  }
}
