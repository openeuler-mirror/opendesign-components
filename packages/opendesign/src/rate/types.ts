import type { ExtractPropTypes, PropType } from 'vue';
import type { ColorT } from '../_utils/types';

export const RateItemStatusTypes = ['full', 'half', 'empty'] as const;
export type RateItemStatusT = (typeof RateItemStatusTypes)[number];

export const RateSizeTypes = ['large', 'medium'] as const;
export type RateSizeT = (typeof RateSizeTypes)[number];

export const rateProps = {
  /**
   * 评分数量
   */
  count: {
    type: Number,
    default: 5,
  },
  /**
   * 双向绑定值
   */
  modelValue: {
    type: Number,
  },
  /**
   * 非受控状态时，默认值
   */
  defaultValue: {
    type: Number,
    default: 0,
  },
  /**
   * 尺寸 RateSizeT
   */
  size: {
    type: String as PropType<RateSizeT>,
  },
  /**
   * 颜色类型 ColorT
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 是否只读
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否支持半选
   */
  allowHalf: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否支持可清空
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * 文字
   */
  labels: {
    type: Array as PropType<Array<string>>,
  },
};

export const rateItemProps = {
  /**
   * 序号
   */
  index: {
    type: Number,
  },
  /**
   * 状态
   */
  status: {
    type: String as PropType<RateItemStatusT>,
    default: 'empty',
  },
};

export type RatePropsT = ExtractPropTypes<typeof rateProps>;
