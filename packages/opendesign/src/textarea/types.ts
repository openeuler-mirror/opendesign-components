import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';
import { inTextareaProps } from '../_components/in-textarea/types';

export const textareaProps = {
  ...inTextareaProps,
  /**
   * @zh-CN 尺寸
   * @en-US Size
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 圆角
   * @en-US Round
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 颜色类型
   * @en-US Color type
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * @zh-CN 形状变体
   * @en-US Shape variant
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
};

export type TextareaPropsT = ExtractPropTypes<typeof textareaProps>;
