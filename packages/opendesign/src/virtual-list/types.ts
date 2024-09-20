import { ExtractPropTypes, PropType } from 'vue';
import { BaseScrollerPropsT } from '../scrollbar';

/**
 * 虚拟滚动的子项不能使用margin，会导致总高度计算不准确（无法包含margin）
 */

export const virtualListProps = {
  /**
   * 禁用横向滚动
   */
  list: {
    type: Array<any>,
    required: true,
    default: [],
  },
  itemSize: {
    type: Number,
  },
  defaultStartIndex: {
    type: Number,
    default: 0,
  },
  buffer: {
    type: Number,
  },
  /**
   * 使用内置scrollbar，支持传递scrollbar配置项
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
};
export type VirtualListPropsT = ExtractPropTypes<typeof virtualListProps>;
