import { ExtractPropTypes, PropType } from 'vue';
import { BaseScrollerPropsT } from '../scrollbar';

/**
 * 虚拟滚动的子项不能使用margin，会导致总高度计算不准确（无法包含margin）
 */

export const virtualListProps = {
  /**
   * 列表数据
   */
  list: {
    type: Array<any>,
    required: true,
    default: [],
  },
  /**
   * 每一项的高度，如果每一项高度不一致或不确定（渲染时确定），则不传
   */
  itemSize: {
    type: Number,
  },
  /**
   * 默认滚动到第几项
   */
  defaultStartIndex: {
    type: Number,
    default: 0,
  },
  /**
   * 前后预留项，减少滚动式空白
   */
  buffer: {
    type: Number,
    default: 1,
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
