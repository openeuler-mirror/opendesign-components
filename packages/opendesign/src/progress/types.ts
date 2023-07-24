import { ExtractPropTypes, PropType } from 'vue';

export const ProgressVariantTypes = ['line', 'circle'] as const;
export type ProgressVariantT = (typeof ProgressVariantTypes)[number];

export const ProgressSizeTypes = ['medium', 'small'] as const;
export type ProgressSizeT = (typeof ProgressSizeTypes)[number];

export const ProgressColorTypes = ['primary', 'success', 'warning', 'danger'] as const;
export type ProgressColorT = (typeof ProgressColorTypes)[number];

export const progressProps = {
  /**
   * 进度条类型 ProgressVariantT
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
  },
  /**
   * 进度条尺寸类型 ProgressSizeT
   */
  size: {
    type: String as PropType<ProgressSizeT>,
    default: 'medium',
  },
  /**
   * 进度条颜色类型 ProgressColorT
   */
  color: {
    type: String as PropType<ProgressColorT>,
    default: 'primary',
  },
  /**
   * 进度条轨道宽度，当为环形进度条时，仅支持Number
   */
  trackWidth: {
    type: [Number, String],
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
