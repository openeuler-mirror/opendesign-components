import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';
import { inInputProps } from '../_components/in-input/types';

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
};

export type InputPropsT = ExtractPropTypes<typeof inputProps>;
