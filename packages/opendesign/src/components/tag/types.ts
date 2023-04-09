import { ExtractPropTypes, PropType } from 'vue';
import { SizeT, RoundT, ColorT } from '../_shared/global';

export const TagVariantTypes = ['solid', 'outline'] as const;
export type TagVariantT = typeof TagVariantTypes[number];

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
   * 标签尺寸 SizeT
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
