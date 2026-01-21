import { ExtractPropTypes } from 'vue';
import { inInputProps } from '../_components/in-input/types';
import { inBoxProps } from '../_components/in-box/types';

const { size, round, color, variant } = inBoxProps;
export const inputProps = {
  ...inInputProps,
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
   * @zh-CN 输入框颜色
   * @en-US Color
   * @default 'normal'
   */
  color,
  /**
   * @zh-CN 输入框类型
   * @en-US variant
   * @default 'outline'
   */
  variant,
  /**
   * @zh-CN 输入框的值 v-model
   * @en-US The value of the input box
   */
  modelValue: {
    type: [String, Number],
  },
  /**
   * @zh-CN 输入框的默认值,非受控
   * @en-US The default value of the input box.Uncontrolled.
   */
  defaultValue: {
    type: [String, Number],
  },
};

export type InputPropsT = ExtractPropTypes<typeof inputProps>;
