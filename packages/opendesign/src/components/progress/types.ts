import { ExtractPropTypes, PropType } from 'vue';

import type { ColorT } from '../_shared/global';

export type ProgressVariantT = 'line' | 'circle';

export type ProgressColorT = 'primary' | 'success' | 'warning' | 'danger';

export const progressProps = {
  /**
   * 进度条类型
   * 'line' | 'circle'
   */
  variant: {
    type: String as PropType<ProgressVariantT>,
    default: 'line',
  },
  /**
   * 进度条百分比
   */
  percentage: {
    type: Number,
    default: 0,
    validator: (val: number): boolean => val >= 0 && val <= 100,
  },
  /**
   * 进度条线宽
   */
  strokeWidth: {
    type: Number,
    default: 6,
  },
  /**
   * 进度条颜色类型
   * 'primary' | 'success' | 'warning' | 'danger'
   */
  color: {
    type: String as PropType<ProgressColorT>,
    default: 'primary',
  },
  /**
   * 环形进度条尺寸
   */
  width: {
    type: Number,
    default: 80,
  },
  /**
   * 格式化文字
   */
  format: {
    type: Function as PropType<(percentage: number) => string>,
    default: (percentage: number) => `${percentage}%`,
  },
  /**
   * 是否展示文字
   */
  showLabel: {
    type: Boolean,
    default: true,
  },
  /**
   * 线形进度条，文字是否在进度条内部
   */
  labelInside: {
    type: Boolean,
    default: false,
  },
};

export type ProgressPropsT = ExtractPropTypes<typeof progressProps>;
