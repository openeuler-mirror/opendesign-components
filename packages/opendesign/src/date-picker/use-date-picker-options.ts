import { computed, Ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { useI18n } from '../locale';
import { DatePickerColumnOption } from '../time-picker/types.ts';

import { DisabledDateFn, DisabledMonthFn, DisabledYearFn } from './types.ts';

interface UseDatePickerOptionsParams {
  currentYear: Ref<number>;
  currentMonth: Ref<number>;
  disabledDate?: Ref<DisabledDateFn | undefined>;
  disabledMonth?: Ref<DisabledMonthFn | undefined>;
  disabledYear?: Ref<DisabledYearFn | undefined>;
  minDate?: Ref<Date | string | number | null | undefined>;
  maxDate?: Ref<Date | string | number | null | undefined>;
}

interface BuildMonthOptionsParams {
  /** 当前年份 */
  currentYear: number;
  /** 解析后的最小日期 */
  parsedMin: Dayjs | null;
  /** 解析后的最大日期 */
  parsedMax: Dayjs | null;
  /** 月份名称获取函数 */
  getLabel: (m: number) => string;
}

interface BuildDayOptionsParams {
  /** 当前年份 */
  currentYear: number;
  /** 当前月份（0-indexed） */
  currentMonth: number;
  /** 解析后的最小日期 */
  parsedMin: Dayjs | null;
  /** 解析后的最大日期 */
  parsedMax: Dayjs | null;
  /** 日期单位后缀 */
  dayUnit: string;
}

interface ComputeDisabledMonthsParams {
  /** 当前年份 */
  currentYear: number;
  /** 自定义禁用日期函数 */
  disabledDate?: DisabledDateFn;
  /** 自定义禁用月份函数 */
  disabledMonth?: DisabledMonthFn;
}

interface ComputeDisabledDaysParams {
  /** 当前年份 */
  currentYear: number;
  /** 当前月份（0-indexed） */
  currentMonth: number;
  /** 自定义禁用日期函数 */
  disabledDate?: DisabledDateFn;
}

interface ComputeDisabledYearsParams {
  /** 年份选项列表 */
  yearOptions: DatePickerColumnOption[];
  /** 自定义禁用日期函数 */
  disabledDate?: DisabledDateFn;
  /** 自定义禁用年份函数 */
  disabledYear?: DisabledYearFn;
}

interface DayCheckParams {
  /** 年份 */
  year: number;
  /** 月份（0-indexed） */
  month: number;
  /** 日（1-indexed） */
  day: number;
  /** 禁用日期判断函数 */
  disabledDate: DisabledDateFn;
}

interface UseDateOptionsParams {
  /** 解析后的最小日期 */
  parsedMinDate: Ref<Dayjs | null>;
  /** 解析后的最大日期 */
  parsedMaxDate: Ref<Dayjs | null>;
  /** 当前年份 */
  currentYear: Ref<number>;
  /** 当前月份 */
  currentMonth: Ref<number>;
  /** 月份标签名获取函数 */
  getMonthLabel: (m: number) => string;
  /** 年份单位后缀获取函数（响应式，支持运行时语言切换） */
  getYearUnit: () => string;
  /** 日期单位后缀获取函数（响应式，支持运行时语言切换） */
  getDayUnit: () => string;
}

interface UseDateDisabledOptionsParams {
  /** 年份选项 */
  yearOptions: Ref<DatePickerColumnOption[]>;
  /** 当前年份 */
  currentYear: Ref<number>;
  /** 当前月份 */
  currentMonth: Ref<number>;
  /** 自定义禁用日期函数 */
  disabledDate?: Ref<DisabledDateFn | undefined>;
  /** 自定义禁用月份函数 */
  disabledMonth?: Ref<DisabledMonthFn | undefined>;
  /** 自定义禁用年份函数 */
  disabledYear?: Ref<DisabledYearFn | undefined>;
}

/**
 * 将日期值解析为 Dayjs 对象，无效或空值返回 null
 * @param value - 日期值（Date/string/number/null/undefined）
 * @returns Dayjs 对象或 null
 */
function parseDateBound(value: Date | string | number | null | undefined): Dayjs | null {
  return value ? dayjs(value) : null;
}

/**
 * 根据 min/max 日期解析有效的年份范围
 * @param parsedMin - 解析后的最小日期
 * @param parsedMax - 解析后的最大日期
 * @returns 年份上下限
 */
function resolveYearRange(parsedMin: Dayjs | null, parsedMax: Dayjs | null): { minYear: number; maxYear: number } {
  return {
    minYear: parsedMin ? parsedMin.year() : 1900,
    maxYear: parsedMax ? parsedMax.year() : 2100,
  };
}

/**
 * 生成年份选项列表
 * @param minYear - 最小年份
 * @param maxYear - 最大年份
 * @param yearUnit - 年份单位后缀（如 "年"）
 * @returns 年份选项列表
 */
function buildYearOptions(minYear: number, maxYear: number, yearUnit: string): DatePickerColumnOption[] {
  const years: DatePickerColumnOption[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push({ label: `${y}${yearUnit}`, value: y });
  }
  return years;
}

/**
 * 生成月份选项列表（受 min/max 边界约束）
 * @param currentYear - 当前面板年份
 * @param parsedMin - 解析后的最小日期
 * @param parsedMax - 解析后的最大日期
 * @param getLabel - 月份名称获取函数
 * @returns 月份选项列表
 */
function buildMonthOptions({ currentYear, parsedMin, parsedMax, getLabel }: BuildMonthOptionsParams): DatePickerColumnOption[] {
  const minMonth = parsedMin && currentYear === parsedMin.year() ? parsedMin.month() : 0;
  const maxMonth = parsedMax && currentYear === parsedMax.year() ? parsedMax.month() : 11;
  const months: DatePickerColumnOption[] = [];
  for (let m = minMonth; m <= maxMonth; m++) {
    months.push({ label: getLabel(m), value: m });
  }
  return months;
}

/**
 * 生成日期选项列表（受 min/max 边界约束）
 * @param currentYear - 当前面板年份
 * @param currentMonth - 当前面板月份
 * @param parsedMin - 解析后的最小日期
 * @param parsedMax - 解析后的最大日期
 * @param dayUnit - 日期单位后缀（如 "日"）
 * @returns 日期选项列表
 */
function buildDayOptions({ currentYear, currentMonth, parsedMin, parsedMax, dayUnit }: BuildDayOptionsParams): DatePickerColumnOption[] {
  const daysInMonth = dayjs().year(currentYear).month(currentMonth).daysInMonth();
  const minDay = parsedMin && currentYear === parsedMin.year() && currentMonth === parsedMin.month() ? parsedMin.date() : 1;
  const maxDay = parsedMax && currentYear === parsedMax.year() && currentMonth === parsedMax.month() ? parsedMax.date() : daysInMonth;
  const days: DatePickerColumnOption[] = [];
  for (let d = minDay; d <= maxDay; d++) {
    days.push({ label: `${d}${dayUnit}`, value: d });
  }
  return days;
}

/**
 * 判断给定年月是否被禁用（用于月份面板禁用选项计算）
 * @param year - 年份
 * @param month - 月份（0-indexed）
 * @param options - 禁用函数选项
 * @returns 该月份是否被禁用
 */
function isMonthItemDisabled(year: number, month: number, options: { disabledDate?: DisabledDateFn; disabledMonth?: DisabledMonthFn }): boolean {
  const testDate = dayjs().year(year).month(month).date(1);
  const params = { date: testDate.toDate(), year: testDate.year(), month: testDate.month(), day: testDate.date() };
  return !!(options.disabledMonth?.(params) || options.disabledDate?.(params));
}

/**
 * 计算月份面板的禁用月份列表
 * @param currentYear - 当前年份
 * @param disabledDate - 自定义禁用日期函数
 * @param disabledMonth - 自定义禁用月份函数
 * @returns 禁用月份索引数组，无禁用时返回 undefined
 */
function computeDisabledMonths({ currentYear, disabledDate, disabledMonth }: ComputeDisabledMonthsParams): number[] | undefined {
  if (!disabledDate && !disabledMonth) return undefined;
  const disabled: number[] = [];
  for (let m = 0; m < 12; m++) {
    if (isMonthItemDisabled(currentYear, m, { disabledDate, disabledMonth })) disabled.push(m);
  }
  return disabled.length > 0 ? disabled : undefined;
}

/**
 * 判断给定日期是否被禁用（日期模式）
 * @param year - 年份
 * @param month - 月份（0-indexed）
 * @param day - 日（1-indexed）
 * @param disabledDate - 禁用日期判断函数
 * @returns 该日期是否被禁用
 */
function isDayDisabled({ year, month, day, disabledDate }: DayCheckParams): boolean {
  const testDate = dayjs().year(year).month(month).date(day);
  const params = { date: testDate.toDate(), year: testDate.year(), month: testDate.month(), day: testDate.date() };
  return disabledDate(params);
}

/**
 * 计算日期面板的禁用日期列表
 * @param currentYear - 当前年份
 * @param currentMonth - 当前月份（0-indexed）
 * @param disabledDate - 自定义禁用日期函数
 * @returns 禁用日期数组（1-indexed），无禁用时返回 undefined
 */
function computeDisabledDays({ currentYear, currentMonth, disabledDate }: ComputeDisabledDaysParams): number[] | undefined {
  if (!disabledDate) return undefined;
  const disabled: number[] = [];
  for (let d = 1; d <= 31; d++) {
    const testDate = dayjs().year(currentYear).month(currentMonth).date(d);
    if (testDate.month() !== currentMonth && d > testDate.daysInMonth()) break;
    if (isDayDisabled({ year: currentYear, month: currentMonth, day: d, disabledDate })) disabled.push(d);
  }
  return disabled.length > 0 ? disabled : undefined;
}

/**
 * 判断给定年份是否被禁用（年份面板）
 * @param year - 年份
 * @param options - 禁用函数选项
 * @returns 该年份是否被禁用
 */
function isYearItemDisabled(year: number, options: { disabledDate?: DisabledDateFn; disabledYear?: DisabledYearFn }): boolean {
  const testDate = dayjs().year(year).month(0).date(1);
  const { disabledDate, disabledYear } = options;
  return !!(disabledYear?.({ date: testDate.toDate(), year }) || disabledDate?.({ date: testDate.toDate(), year, month: 0, day: 1 }));
}

/**
 * 计算年份面板的禁用年份列表
 * @param yearOptions - 年份选项列表
 * @param disabledDate - 自定义禁用日期函数
 * @param disabledYear - 自定义禁用年份函数
 * @returns 禁用年份数组，无禁用时返回 undefined
 */
function computeDisabledYears({ yearOptions, disabledDate, disabledYear }: ComputeDisabledYearsParams): number[] | undefined {
  if (!disabledDate && !disabledYear) return undefined;
  const disabled: number[] = [];
  for (const opt of yearOptions) {
    if (isYearItemDisabled(opt.value, { disabledDate, disabledYear })) disabled.push(opt.value);
  }
  return disabled.length > 0 ? disabled : undefined;
}

/** 管理日期边界解析（parsedMinDate / parsedMaxDate） */
function useDateBounds(
  minDate: Ref<Date | string | number | null | undefined> | undefined,
  maxDate: Ref<Date | string | number | null | undefined> | undefined,
) {
  const parsedMinDate = computed(() => parseDateBound(minDate?.value));
  const parsedMaxDate = computed(() => parseDateBound(maxDate?.value));
  return { parsedMinDate, parsedMaxDate };
}

/** 管理日期面板的年月日选项（yearOptions / monthOptions / dayOptions） */
function useDateOptions({ parsedMinDate, parsedMaxDate, currentYear, currentMonth, getMonthLabel, getYearUnit, getDayUnit }: UseDateOptionsParams) {
  const yearOptions = computed<DatePickerColumnOption[]>(() => {
    const { minYear, maxYear } = resolveYearRange(parsedMinDate.value, parsedMaxDate.value);
    return buildYearOptions(minYear, maxYear, getYearUnit());
  });

  const monthOptions = computed<DatePickerColumnOption[]>(() =>
    buildMonthOptions({ currentYear: currentYear.value, parsedMin: parsedMinDate.value, parsedMax: parsedMaxDate.value, getLabel: getMonthLabel }),
  );

  const dayOptions = computed<DatePickerColumnOption[]>(() =>
    buildDayOptions({
      currentYear: currentYear.value,
      currentMonth: currentMonth.value,
      parsedMin: parsedMinDate.value,
      parsedMax: parsedMaxDate.value,
      dayUnit: getDayUnit(),
    }),
  );

  return { yearOptions, monthOptions, dayOptions };
}

/** 管理日期面板的禁用选项（disabledYear / Month / DayOptions） */
function useDateDisabledOptions({ yearOptions, currentYear, currentMonth, disabledDate, disabledMonth, disabledYear }: UseDateDisabledOptionsParams) {
  const disabledMonthOptions = computed<number[] | undefined>(() =>
    computeDisabledMonths({ currentYear: currentYear.value, disabledDate: disabledDate?.value, disabledMonth: disabledMonth?.value }),
  );

  const disabledDayOptions = computed<number[] | undefined>(() =>
    computeDisabledDays({ currentYear: currentYear.value, currentMonth: currentMonth.value, disabledDate: disabledDate?.value }),
  );

  const disabledYearOptions = computed<number[] | undefined>(() =>
    computeDisabledYears({ yearOptions: yearOptions.value, disabledDate: disabledDate?.value, disabledYear: disabledYear?.value }),
  );

  return { disabledYearOptions, disabledMonthOptions, disabledDayOptions };
}

export const useDatePickerOptions = ({
  currentYear,
  currentMonth,
  disabledDate,
  disabledMonth,
  disabledYear,
  minDate,
  maxDate,
}: UseDatePickerOptionsParams) => {
  const { t } = useI18n();
  const { parsedMinDate, parsedMaxDate } = useDateBounds(minDate, maxDate);
  const { yearOptions, monthOptions, dayOptions } = useDateOptions({
    parsedMinDate,
    parsedMaxDate,
    currentYear,
    currentMonth,
    getMonthLabel: (m) => t(`datePicker.monthsShort.${m}`),
    getYearUnit: () => t('datePicker.yearUnit'),
    getDayUnit: () => t('datePicker.dayUnit'),
  });
  const { disabledYearOptions, disabledMonthOptions, disabledDayOptions } = useDateDisabledOptions({
    yearOptions,
    currentYear,
    currentMonth,
    disabledDate,
    disabledMonth,
    disabledYear,
  });
  return { yearOptions, monthOptions, dayOptions, disabledYearOptions, disabledMonthOptions, disabledDayOptions };
};
