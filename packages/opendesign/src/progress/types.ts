import { ExtractPropTypes, PropType } from 'vue';

export const ProgressVariantTypes = ['line', 'circle'] as const;
export type ProgressVariantT = (typeof ProgressVariantTypes)[number];

export const ProgressSizeTypes = ['medium', 'small'] as const;
export type ProgressSizeT = (typeof ProgressSizeTypes)[number];

export const ProgressColorTypes = ['primary', 'success', 'warning', 'danger'] as const;
export type ProgressColorT = (typeof ProgressColorTypes)[number];

export const progressProps = {
  /**
   * @zh-CN 进度条类型
   * @en-US Progress bar type.
   * @default 'line'
   */
  variant: {
    type: String as PropType<ProgressVariantT>,
    default: 'line',
  },
  /**
   * @zh-CN 进度条百分比
   * @en-US Progress bar percentage.
   * @default 0
   * @validator (val: number): boolean => val >= 0 && val <= 100
   */
  percentage: {
    type: Number,
    default: 0,
    validator: (val: number): boolean => val >= 0 && val <= 100,
  },
  /**
   * @zh-CN 进度条线宽
   * @en-US Width of the progress bar.
   */
  strokeWidth: {
    type: Number,
  },
  /**
   * @zh-CN 进度条尺寸
   * @en-US Progress bar size.
   * @default 'medium'
   */
  size: {
    type: String as PropType<ProgressSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN 进度条颜色
   * @en-US Progress bar color.
   * @default 'primary'
   */
  color: {
    type: String as PropType<ProgressColorT>,
    default: 'primary',
  },
  /**
   * @zh-CN 进度条轨道宽度，当为环形进度条时，仅支持Number
   * @en-US The width of the progress bar track, when it is a circular progress bar, only supports Number.
   */
  trackWidth: {
    type: [Number, String],
  },
  /**
   * @zh-CN 格式化文字
   * @en-US Formatted text.
   * @default (percentage: number) => `${percentage}%`
   */
  format: {
    type: Function as PropType<(percentage: number) => string>,
    default: (percentage: number) => `${percentage}%`,
  },
  /**
   * @zh-CN 是否展示文字
   * @en-US Whether to display text.
   * @default true
   */
  showLabel: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 线形进度条，文字是否在进度条内部
   * @en-US Linear progress bar. Is the text inside the progress bar.
   * @default false
   */
  labelInside: {
    type: Boolean,
    default: false,
  },
};

export type ProgressPropsT = ExtractPropTypes<typeof progressProps>;
