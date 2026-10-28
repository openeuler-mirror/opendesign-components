import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../../_utils/types';

export const inBoxProps = {
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
   * 是否多行控件（如 textarea、select/cascader 多选）。
   * 为真时 pill 不内联 100vh（高盒子上半高 clamp 会形成巨大圆弧），
   * 圆角改由样式层按 size 提供常数（同 size 单行 pill 圆角），
   * 自定义 round 值不受影响。
   */
  multiline: {
    type: Boolean,
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
  /**
   * 是否聚焦
   */
  focused: {
    type: Boolean,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * 是否只读
   */
  readonly: {
    type: Boolean,
  },
};

export type InBoxProps = ExtractPropTypes<typeof inBoxProps>;
