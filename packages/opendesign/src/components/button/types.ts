import { ExtractPropTypes, PropType } from 'vue';
import { RoundT, ColorT, VariantT } from '../_shared/global';

export const ButtonSizeTypes = ['large', 'medium', 'small', 'mini'] as const;
export type ButtonSizeT = typeof ButtonSizeTypes[number];

export const buttonProps = {
  /**
   * 颜色类型 ColorT
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 按钮类型 VariantT
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * 按钮尺寸 ButtonSizeT
   */
  size: {
    type: String as PropType<ButtonSizeT>,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 是否为loading状态
   */
  loading: {
    type: Boolean,
  },
  /**
   * 是否为禁用状态
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 链接跳转
   */
  href: {
    type: String,
  },
};

export type ButtonPropsT = ExtractPropTypes<typeof buttonProps>;
