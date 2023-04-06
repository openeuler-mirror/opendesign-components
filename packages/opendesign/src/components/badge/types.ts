import type { ExtractPropTypes, PropType } from 'vue';
import type { ColorT } from '../_shared/global';

export const badgeProps = {
  /**
   * 显示值
   */
  value: {
    type: [String, Number],
    default: '',
  },
  /**
   * 最大值，超过最大值显示${max}+(仅当 value 类型为 number 时生效)
   */
  max: {
    type: Number,
    default: 99,
  },
  /**
   * 颜色类型 'normal' | 'primary' | 'success' | 'warning' | 'danger'
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 是否显示为小红点
   */
  dot: {
    type: Boolean,
    default: false,
  },
  /**
   * 徽标位置偏移量
   */ offset: {
    type: Array as PropType<Array<number | string>>,
    default: () => [],
  },
};

export type BadgePropsT = ExtractPropTypes<typeof badgeProps>;
