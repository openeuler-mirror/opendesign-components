import { ExtractPropTypes, PropType } from 'vue';

import { inputProps } from '../input/types';

const { size, round, color, variant, placeholder, readonly, disabled, autoWidth, format, inputId } = inputProps;

export const InputNumberControlTypes = ['both', 'right', 'left', 'none'] as const;
export type InputNumberControlT = (typeof InputNumberControlTypes)[number];

export const inputNumberProps = {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: {
    type: Number,
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: Number,
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
   */
  format,
  /**
   * 无效值判断
   */
  validate: {
    type: Function as PropType<(value: number) => boolean>,
  },
  /**
   * input id
   */
  inputId,
  /**
   * 当输入为空字符串时，默认值
   */
  clearValue: {
    type: Number,
  },
};

export type InputNumberPropsT = ExtractPropTypes<typeof inputNumberProps>;
