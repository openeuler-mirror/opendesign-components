import { ExtractPropTypes, PropType } from 'vue';

import { inputProps } from '../input/types';

const { size, round, color, variant, placeholder, readonly, disabled, autoWidth, format, inputId } = inputProps;

export const InputNumberControlTypes = ['both', 'right', 'left', 'none'] as const;
export type InputNumberControlT = (typeof InputNumberControlTypes)[number];

export const inputNumberProps = {
  /**
   * @zh-CN 数字输入框的值 v-model
   * @en-US The value of the input number
   */
  modelValue: {
    type: Number,
  },
  /**
   * @zh-CN 数字输入框的默认值,非受控
   * @en-US The default value of the input number, uncontrolled
   */
  defaultValue: {
    type: Number,
  },
  /**
   * @zh-CN 按钮点击时步长
   * @en-US Step size when clicking buttons
   * @default 1
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 最小值
   * @en-US Minimum value
   */
  min: {
    type: Number,
  },
  /**
   * @zh-CN 最大值
   * @en-US Maximum value
   */
  max: {
    type: Number,
  },
  /**
   * @zh-CN 控制按钮位置
   * @en-US Control button position
   * @default 'both'
   */
  controls: {
    type: String as PropType<InputNumberControlT>,
    default: 'both',
  },
  /**
   * @zh-CN 是否可以清除
   * @en-US Whether the value can be cleared
   */
  clearable: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 大小
   * @en-US Size
   */
  size,
  /**
   * @zh-CN 圆角值
   * @en-US Round
   */
  round,
  /**
   * @zh-CN 颜色类型
   * @en-US Color type
   * @default 'normal'
   */
  color,
  /**
   * @zh-CN 按钮类型
   * @en-US Variant type
   * @default 'outline'
   */
  variant,
  /**
   * @zh-CN 提示文本
   * @en-US Prompt text
   */
  placeholder,
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled,
  /**
   * @zh-CN 是否只读
   * @en-US Readonly
   */
  readonly,
  /**
   * @zh-CN 是否自动适配宽度
   * @en-US Whether the width is automatically adapted
   */
  autoWidth,
  /**
   * @zh-CN 对值格式化，控制显示格式
   * @en-US Format the value and control the display format
   */
  format,
  /**
   * @zh-CN 无效值判断
   * @en-US Invalid value validation
   */
  validate: {
    type: Function as PropType<(value: number) => boolean>,
  },
  /**
   * @zh-CN input id, 用于label关联
   * @en-US Input id, used for label association
   */
  inputId,
  /**
   * @zh-CN 当输入为空字符串时的默认值
   * @en-US Default value when the input is empty
   */
  clearValue: {
    type: Number,
  },
};

export type InputNumberPropsT = ExtractPropTypes<typeof inputNumberProps>;
