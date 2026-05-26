import { ExtractPublicPropTypes, PropType } from 'vue';

import { PopupPositionT, PopupTriggerT } from '../popup';
import { inputProps } from '../input';
import { selectProps } from '../select';
import { timePickerProps, DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn } from '../time-picker';

export type { DisabledHoursFn, DisabledMinutesFn, DisabledSecondsFn };
export type DatePickerMode = 'datetime' | 'date' | 'month' | 'year';
export type DisabledDateFn = (opts: { date: Date; year: number; /** 0-indexed，0=一月，11=十二月 */ month: number; day: number }) => boolean;
export type DisabledMonthFn = (opts: { date: Date; year: number; /** 0-indexed，0=一月，11=十二月 */ month: number }) => boolean;
export type DisabledYearFn = (opts: { date: Date; year: number }) => boolean;
export type DateModelValue = Date | string | number | undefined | null;

export type DatePickerShortcutSlotProps = {
  setValue: (value?: number) => void;
  emitChange: () => void;
};

export type DatePickerRangeShortcutSlotProps = {
  setValue: (start?: number, end?: number) => void;
  emitChange: () => void;
};

// ── 基础 props（所有选择器共用）
const { placeholder, inputId, disabled, readonly, size, round, color, variant } = inputProps;
const { noResponsive, optionTitle } = selectProps;

export const basePickerProps = {
  placeholder,
  inputId,
  disabled,
  readonly,
  size,
  round,
  color,
  variant,
  noResponsive,
  optionTitle,
};

// ── 弹出层 props
export const popupPickerProps = {
  /**
   * @zh-CN 选项触发方式
   * @en-US Option trigger method.
   * @default 'click'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * @zh-CN 弹出框位置
   * @en-US Popup position.
   * @default 'bl'
   */
  popupPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 弹出框挂载容器
   * @en-US Popup wrapper.
   * @default 'body'
   */
  popupWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 是否在结束选择时，卸载所有选项
   * @en-US Whether to unmount all options when ending the selection.
   * @default true
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transition name.
   */
  transition: {
    type: String,
  },
};

// ── 日期约束 props
export const dateConstraintProps = {
  /**
   * @zh-CN 禁用日期的判断函数
   * @en-US Function to specify the dates that cannot be selected.
   */
  disabledDate: {
    type: Function as PropType<DisabledDateFn>,
    default: undefined,
  },
  /**
   * @zh-CN 禁用月份的判断函数，month 为 0-indexed（0=一月，11=十二月）
   * @en-US Function to specify the months that cannot be selected. month is 0-indexed (0=January, 11=December).
   */
  disabledMonth: {
    type: Function as PropType<DisabledMonthFn>,
    default: undefined,
  },
  /**
   * @zh-CN 禁用年份的判断函数
   * @en-US Function to specify the years that cannot be selected.
   */
  disabledYear: {
    type: Function as PropType<DisabledYearFn>,
    default: undefined,
  },
  /**
   * @zh-CN 最小可选日期（Date、格式字符串或时间戳）
   * @en-US Minimum selectable date (Date object, formatted string or timestamp).
   */
  minDate: {
    type: [Date, String, Number] as PropType<DateModelValue>,
    default: undefined,
  },
  /**
   * @zh-CN 最大可选日期（Date、格式字符串或时间戳）
   * @en-US Maximum selectable date (Date object, formatted string or timestamp).
   */
  maxDate: {
    type: [Date, String, Number] as PropType<DateModelValue>,
    default: undefined,
  },
  /**
   * @zh-CN 每周起始日，0=周日，1=周一，...，6=周六
   * @en-US Day start of week. 0=Sunday, 1=Monday, ..., 6=Saturday.
   * @default 1
   */
  dayStartOfWeek: {
    type: Number,
    default: 1,
  },
};

// ── 时间约束 props（从 timePickerProps 取出对应字段）
const { hourStep, minuteStep, secondStep, disabledHours, disabledMinutes, disabledSeconds, minTime, maxTime } = timePickerProps;

export const timeConstraintProps = {
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime,
  maxTime,
};

// ── 格式化 props
const formatProps = {
  /**
   * @zh-CN 输入和显示日期格式，支持dayjs的format允许的值
   * @en-US Input and display date format. Support valid dayjs format param.
   * @default 'YYYY-MM-DD'
   */
  format: {
    type: String,
    default: 'YYYY/MM/DD',
  },
  /**
   * @zh-CN 绑定值日期格式，支持dayjs的format允许的值, 'x' 代表时间戳
   * @en-US Bound Date format. Support valid dayjs format param. 'x' as timestamp
   */
  valueFormat: {
    type: String,
    default: 'x',
  },
  /**
   * @zh-CN 支持快速清除
   * @en-US Support quick clearing.
   */
  clearable: {
    type: Boolean,
  },
};

// ── 各组件 props 组合
export const yearPickerProps = {
  ...basePickerProps,
  ...popupPickerProps,
  ...formatProps,
  format: {
    type: String,
    default: 'YYYY',
  },
  disabledYear: dateConstraintProps.disabledYear,
  /**
   * @zh-CN 当返回值只有年、月份或日期时，补全细节时间戳的默认值
   * @en-US When the return value only contains year, month, or date, populate the timestamp with default values for the missing time components.
   */
  defaultValue: {
    type: Date as PropType<Date>,
    default: () => new Date('1970/01/01 00:00:00'),
  },
};

export const monthPickerProps = {
  ...yearPickerProps,
  format: {
    type: String,
    default: 'YYYY/MM',
  },
  disabledMonth: dateConstraintProps.disabledMonth,
  disabledYear: dateConstraintProps.disabledYear,
};

export const datePickerProps = {
  ...monthPickerProps,
  format: {
    type: String,
    default: 'YYYY/MM/DD',
  },
  disabledDate: dateConstraintProps.disabledDate,
  minDate: dateConstraintProps.minDate,
  maxDate: dateConstraintProps.maxDate,
  dayStartOfWeek: dateConstraintProps.dayStartOfWeek,
};

export const dateTimePickerProps = {
  ...datePickerProps,
  ...timeConstraintProps,
  format: { type: String, default: 'YYYY/MM/DD HH:mm:ss' },
};

const rangeExtraProps = {
  /**
   * @zh-CN 开始日期占位文本
   * @en-US Placeholder for start date input.
   */
  placeholderStart: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN 结束日期占位文本
   * @en-US Placeholder for end date input.
   */
  placeholderEnd: {
    type: String,
    default: undefined,
  },
};

export const yearRangePickerProps = {
  ...yearPickerProps,
  defaultValue: {
    type: Array as PropType<Date[]>,
    default: () => [new Date('1970/01/01 00:00:00'), new Date('1970/12/31 23:59:59')],
  },
  ...rangeExtraProps,
};

export const monthRangePickerProps = {
  ...monthPickerProps,
  defaultValue: {
    type: Array as PropType<Date[]>,
    default: () => [new Date('1970/01/01 00:00:00'), new Date('1970/12/31 23:59:59')],
  },
  ...rangeExtraProps,
};

export const dateRangePickerProps = {
  ...datePickerProps,
  /**
   * @zh-CN 当返回值只有年、月份或日期时，补全细节时间戳的默认值
   * @en-US When the return value only contains year, month, or date, populate the timestamp with default values for the missing time components.
   */
  defaultValue: {
    type: Array as PropType<Date[]>,
    default: () => [new Date('1970/01/01 00:00:00'), new Date('1970/12/31 23:59:59')],
  },
  ...rangeExtraProps,
};

export const dateTimeRangePickerProps = {
  ...dateTimePickerProps,
  defaultValue: {
    type: Array as PropType<Date[]>,
    default: () => [new Date('1970/01/01 00:00:00'), new Date('1970/12/31 23:59:59')],
  },
  ...rangeExtraProps,
  format: { type: String, default: 'YYYY/MM/DD HH:mm:ss' },
};

// ── 类型导出
export type YearPickerPropsT = ExtractPublicPropTypes<typeof yearPickerProps>;
export type MonthPickerPropsT = ExtractPublicPropTypes<typeof monthPickerProps>;
export type DatePickerPropsT = ExtractPublicPropTypes<typeof datePickerProps>;
export type DateTimePickerPropsT = ExtractPublicPropTypes<typeof dateTimePickerProps>;
export type YearRangePickerPropsT = ExtractPublicPropTypes<typeof yearRangePickerProps>;
export type MonthRangePickerPropsT = ExtractPublicPropTypes<typeof monthRangePickerProps>;
export type DateRangePickerPropsT = ExtractPublicPropTypes<typeof dateRangePickerProps>;
export type DateTimeRangePickerPropsT = ExtractPublicPropTypes<typeof dateTimeRangePickerProps>;
