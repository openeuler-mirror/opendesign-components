import { ExtractPropTypes, PropType } from 'vue';
import { RoundT, ColorT } from '../_shared/types';

export const TagColorTypes = ['normal', 'info', 'primary', 'success', 'warning', 'danger'] as const;
export type TagColorT = (typeof TagColorTypes)[number];

export const TagVariantTypes = ['solid', 'outline'] as const;
export type TagVariantT = (typeof TagVariantTypes)[number];

export const TagSizeTypes = ['medium', 'small'] as const;
export type TagSizeT = (typeof TagSizeTypes)[number];

export const tagProps = {
  /**
   * 标签颜色 ColorT
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 标签类型 TagVariantT
   */
  variant: {
    type: String as PropType<TagVariantT>,
    default: 'solid',
  },
  /**
   * 标签尺寸 TagSizeT
   */
  size: {
    type: String as PropType<TagSizeT>,
    default: 'medium',
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 是否可关闭
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * tag是否可见 v-model
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 非受控模式，tag是否默认可见
   */
  defaultVisible: {
    type: Boolean,
    default: true,
  },
  /**
   * 关闭前的钩子函数
   */
  beforeClose: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export type TagPropsT = ExtractPropTypes<typeof tagProps>;
