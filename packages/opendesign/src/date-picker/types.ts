import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';
import { PickerDate } from './picker-date';

export interface ShortcutT {
  label: string;
  value: Date | (() => Date);
}
export type ReservedShortcutT = 'now';
export type ShortcutParamT = ReservedShortcutT | ShortcutT;

export const PickerModes = ['year', 'month', 'date', 'datetime', 'quarter', 'time'] as const;
export type PickerModeT = (typeof PickerModes)[number];

export const AllPickerModes = PickerModes.map((item) => `${item}-range`);
export type ALLPickerModeT = (typeof AllPickerModes)[number];

export type DisaplyYearListT = (year: number) => Array<{ year: number; label: string }>;

export type DisaplyMonthListT = (year: number) => Array<{ year?: number; month: number; label: string }>;

export type DisaplyDayListT = (year: number, month: number) => Array<{ year?: number; month?: number; day: number; label: string }>;

export type DisaplyTimeListT = (date: Date) => Array<{ value: number; label: string }>;

export interface YearCellT {
  year: number;
}
export interface MonthCellT extends Partial<YearCellT> {
  month: number;
}
export interface DayCellT extends Partial<MonthCellT> {
  day: number;
}

export type disableYearCellT = (cell: YearCellT) => boolean;
export type disableMonthCellT = (cell: MonthCellT) => boolean;
export type disableDayCellT = (cell: DayCellT) => boolean;
export type disableTimeCellT = (value: number, type: 'hour' | 'minute' | 'second') => boolean;

export interface TimeValueT {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const commonPickerProps = {
  /**
   * 选择器模式
   */
  mode: {
    type: String as PropType<ALLPickerModeT>,
    default: 'date',
  },
  /**
   * 格式化字符串
   */
  formatString: {
    type: String,
  },
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 颜色类型 Color2T
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * 按钮类型 VariantT
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * 提示文本
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 是否只读
   */
  readonly: {
    type: Boolean,
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * 时间格式化为字符串函数
   */
  format: {
    type: Function as PropType<(d: Date) => string>,
  },
  /**
   * 时间字符串处理为时间函数
   */
  parse: {
    type: Function as PropType<(d: string) => Date>,
  },
  /**
   * 面板上的快捷按钮
   */
  shortcuts: {
    type: [String, Object] as PropType<Array<ShortcutParamT>>,
  },
  /**
   * 面板上是否显示确认按钮
   */
  needConfirm: {
    type: Boolean,
  },
  /**
   * 面板上确认按钮文本
   */
  confirmLabel: {
    type: String,
  },
  /**
   * 日期禁用
   */
  disableCell: {
    type: Function as PropType<disableYearCellT | disableMonthCellT | disableDayCellT>,
  },
  /**
   * 时间禁用
   */
  disableTimeCell: {
    type: Function as PropType<disableTimeCellT>,
  },
  /**
   * 时间禁用
   */
  disableTime: {
    type: Function as PropType<(current: Date, type?: 'start' | 'end') => boolean>,
  },
  /****** month */
  /**
   * 是否支持选择年份
   */
  yearSelectable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否支持选择年份
   */
  // monthSelectable: {
  //   type: [Boolean],
  //   default: true,
  // },
  /**
   * 控制面板展示的年份
   */
  displayYearList: {
    type: Function as PropType<(year: number) => Array<{ year: number; label: string }>>,
  },
  /**
   * 控制面板展示的月份
   */
  displayMonthList: {
    type: Function as PropType<(year: number) => Array<{ year?: number; month: number; label: string }>>,
  },
  /**
   * 控制面板展示的月份
   */
  displayDayList: {
    type: Function as PropType<(year: number, month: number) => Array<{ year?: number; month: number; day: number; label: string }>>,
  },
};

export const datePickerProps = {
  /**
   * 值
   * v-model
   */
  modelValue: {
    type: [Date, String, Number] as PropType<Date | string | number>,
  },
  /**
   * 默认值
   */
  defaultValue: {
    type: [Date, String, Number] as PropType<Date | string | number>,
  },
  ...commonPickerProps,
};

export type DatePickerPropsT = ExtractPropTypes<typeof datePickerProps>;

export const dateRangePickerProps = {
  /**
   * 值
   * v-model
   */
  modelValue: {
    type: Array as PropType<Array<Date | string | number>>,
  },
  /**
   * 默认值
   */
  defaultValue: {
    type: Array as PropType<Array<Date | string | number>>,
  },
  ...commonPickerProps,
};
export type DateRangePickerPropsT = ExtractPropTypes<typeof dateRangePickerProps>;

export { PickerDate };
