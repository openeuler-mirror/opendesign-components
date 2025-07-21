import { ExtractPropTypes, PropType, Component } from 'vue';
import { RoundT, ColorT, VariantT } from '../_utils/types';

export const ButtonSizeTypes = ['large', 'medium', 'small'] as const;
export type ButtonSizeT = (typeof ButtonSizeTypes)[number];

export const buttonProps = {
  /**
   * @zh-CN 颜色类型
   * @en-US Color type
   * @default 'normal'
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * @zh-CN 按钮类型
   * @en-US Button type
   * @default 'outline'
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * @zh-CN 按钮尺寸
   * @en-US Button size
   */
  size: {
    type: String as PropType<ButtonSizeT>,
  },
  /**
   * @zh-CN 圆角值
   * @en-US Border radius
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 是否为加载状态
   * @en-US Loading state
   */
  loading: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Disabled state
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 跳转链接，如果设置了此属性，则按钮会以 a 标签渲染
   * @en-US Link to navigate, if set, the button will render as an anchor tag
   */
  href: {
    type: String,
  },
  /**
   * @zh-CN 前缀图标
   * @en-US Prefix icon
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * @zh-CN 自定义按钮渲染标签
   * @en-US Custom button render tag
   * @default 'button'
   */
  tag: {
    type: String,
    default: 'button',
  },
};

export type ButtonPropsT = ExtractPropTypes<typeof buttonProps>;
