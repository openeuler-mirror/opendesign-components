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
   * @zh-CN 圆角。值为 `pill` 时取同尺寸单行 pill 圆角（胶囊常数，不随内容高度变化，1.2.7-sp3 起多行控件按此语义）；也可以是 CSS `border-radius` 可接受的任意值
   * @en-US Round. When set to `pill`, uses the pill radius of the single-line input of the same size (a capsule constant, not affected by content height; multiline controls follow this semantics since 1.2.7-sp3); any valid CSS `border-radius` value is also accepted
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
