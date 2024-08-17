import { ExtractPropTypes, PropType } from 'vue';
import { inInputProps } from '../_components/in-input/types';
import { inBoxProps } from '../_components/in-box/types';

const { size, round, color, variant } = inBoxProps;
export const inputProps = {
  ...inInputProps,
  /**
   * 输入框的值
   * v-model
   */
  modelValue: {
    type: [String, Number],
  },
  /**
   * 输入框的默认值
   * 非受控
   */
  defaultValue: {
    type: [String, Number],
  },
  size,
  round,
  color,
  variant,
};

export type InputPropsT = ExtractPropTypes<typeof inputProps>;
