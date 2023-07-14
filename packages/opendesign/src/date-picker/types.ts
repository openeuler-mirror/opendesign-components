import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';

export interface ShortcutT {
  label: string;
  value: Date | (() => Date);
}
export type ReservedShortcutT = 'now';
export type ShortcutParamT = ReservedShortcutT | ShortcutT;

export const PickerModes = ['date', 'datetime', 'daterange', 'datetimerange', 'month', 'monthrange', 'year', 'quarter', 'time'] as const;
export type PickerModeT = (typeof PickerModes)[number];

export interface TimeValueT {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const datePickerProps = {
  /**
   * 值
   * v-model
   */
  modelValue: {
    type: [Date, String, Number],
  },
  /**
   * 默认值
   */
  defaultValue: {
    type: [Date, String, Number],
  },
  /**
   * 选择器模式
   */
  mode: {
    type: [String] as PropType<PickerModeT>,
    default: 'date',
  },
  /**
   * 格式化字符串
   */
  formatString: {
    type: [String],
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
    type: [Boolean],
  },
  /**
   * 面板上确认按钮文本
   */
  confirmLabel: {
    type: [String],
  },
};

export type DatePickerPropsT = ExtractPropTypes<typeof datePickerProps>;
