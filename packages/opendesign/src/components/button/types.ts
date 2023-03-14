import { ExtractPropTypes, PropType } from 'vue';
import { RoundT, ColorT, VariantT } from '../_shared/global';

export type ButtonTypeT = 'primary' | 'outline' | 'text' | 'link'

export const buttonProps = {
  /**
   * 颜色类型：ColorT
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal'
  },
  /**
   * 按钮类型：ColorT
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline'
  },
  /**
   * 按钮尺寸：SizeT
   */
  size: {
    type: String as PropType<'mini' | 'small' | 'medium' | 'large'>
  },
  /**
   * 圆角值
   */
  round: {
    type: String as PropType<RoundT>
  },
  /**
   * 是否为loading状态
   */
  loading: {
    type: Boolean
  },
  /**
   * 是否为禁用状态
   */
  disabled: {
    type: Boolean
  },
};

export type ButtonPropsT = ExtractPropTypes<typeof buttonProps>;
