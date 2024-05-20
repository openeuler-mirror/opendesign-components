import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';
import { inTextareaProps } from '../_components/in-textarea/types';

export const textareaProps = {
  ...inTextareaProps,
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

export type TextareaPropsT = ExtractPropTypes<typeof textareaProps>;
