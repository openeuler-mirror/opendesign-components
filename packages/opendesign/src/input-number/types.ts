import { ExtractPropTypes, PropType } from 'vue';

import { inputProps } from '../input/types';

const { size, round, color, variant, placeholder, readonly, disabled, autoWidth, parse, format } = inputProps;

export const InputNumberControlTypes = ['both', 'right', 'left', 'none'] as const;
export type InputNumberControlT = (typeof InputNumberControlTypes)[number];

export const inputNumberPorps = {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: {
    type: [String, Number],
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: [String, Number],
  },
  /**
   * 按钮点击时步长
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * 最小值
   */
  min: {
    type: Number,
  },
  /**
   * 最大值
   */
  max: {
    type: Number,
  },
  /**
   * 控制按钮位置 InputNumberControlT
   */
  controls: {
    type: String as PropType<InputNumberControlT>,
    default: 'both',
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * 大小 SizeT
   */
  size,
  /**
   * 圆角值 RoundT
   */
  round,
  /**
   * 颜色类型 Color2T
   */
  color,
  /**
   * 按钮类型 VariantT
   */
  variant,
  /**
   * 提示文本
   */
  placeholder,
  /**
   * 是否禁用
   */
  disabled,
  /**
   * 是否只读
   */
  readonly,
  /**
   * 是否自动增加宽度
   */
  autoWidth,
  /**
   * 对值格式化，控制显示格式
   * 需搭配parse处理，保证值的正确性
   */
  format,
  /**
   * 解析输入框的值
   */
  parse: {
    type: Function as PropType<(value: string) => number>,
  },
};

export type InputNumberPorpsT = ExtractPropTypes<typeof inputNumberPorps>;
