import type { ExtractPropTypes } from 'vue';
import { inBoxProps } from '../_components/in-box/types';

const { size, round, color } = inBoxProps;

export interface IpSegment {
  value: string;
  invalid: boolean;
}

export const ipInputProps = {
  /**
   * @zh-CN 输入框的值 v-model
   * @en-US The value of the input box
   */
  modelValue: {
    type: String,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN ip片段长度
   * @en-US IP fragment length.
   * @default 4
   */
  segmentsLen: {
    type: Number,
    default: 4,
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
   * @zh-CN 输入框颜色
   * @en-US Color
   * @default 'normal'
   */
  color,
};

export type IpInputPropsT = ExtractPropTypes<typeof ipInputProps>;
