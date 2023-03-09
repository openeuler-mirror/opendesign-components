import { ExtractPropTypes, PropType } from 'vue';
import { SizeT, RoundT, ColorT, VariantT } from '../_shared/global';

export type TagVariantT = 'solid' | 'outline';

export const tagProps = {
  /**
   * 标签颜色
   * 'normal' | 'primary' | 'success' | 'warning' | 'danger';
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 标签类型
   * 'solid' | 'outline'
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'solid',
  },
  /**
   * 标签尺寸
   * 'large' | 'medium' | 'small'
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值
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
   * 是否可选中
   */
  checkable: {
    type: Boolean,
    default: false,
  },
  /**
   * 双向绑定值，是否被选中(标签可选中时该属性生效)
   */
  checked: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 非受控状态时，默认是否选中(标签可选中时该属性生效)
   */
  defaultChecked: {
    type: Boolean,
    default: true,
  },
};

export type TagPropsT = ExtractPropTypes<typeof tagProps>;
