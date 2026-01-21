import type { ExtractPropTypes, PropType } from 'vue';
import type { ColorT } from '../_utils/types';

export const RateItemStatusTypes = ['full', 'half', 'empty'] as const;
export type RateItemStatusT = (typeof RateItemStatusTypes)[number];

export const RateSizeTypes = ['large', 'medium'] as const;
export type RateSizeT = (typeof RateSizeTypes)[number];

export const rateProps = {
  /**
   * @zh-CN 评分总数
   * @en-US Total number of ratings
   * @default 5
   */
  count: {
    type: Number,
    default: 5,
  },
  /**
   * @zh-CN 选中数量
   * @en-US Selected count
   */
  modelValue: {
    type: Number,
  },
  /**
   * @zh-CN 非受控默认选中值
   * @en-US Uncontrolled default selected count
   * @default 0
   */
  defaultValue: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 图标尺寸
   * @en-US Icon size
   */
  size: {
    type: String as PropType<RateSizeT>,
  },
  /**
   * @zh-CN 图标颜色
   * @en-US Icon color
   * @default 'normal'
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * @zh-CN 是否只读
   * @en-US Whether to read-only
   * @default false
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否支持半选
   * @en-US Whether to support half selection
   * @default false
   */
  allowHalf: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否支持可清空
   * @en-US Whether to support clearable
   * @default false
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 提示文字（数组长度应该等于count）
   * @en-US Prompt text (The length of the array should equal to count)
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
