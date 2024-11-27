import { ExtractPropTypes, PropType } from 'vue';
import { BaseScrollerPropsT } from '../scrollbar';

export interface RenderIndexInfo {
  start: number;
  end: number;
  visible: number;
  count: number;
}

/**
 * 虚拟滚动的子项不能使用margin，会导致总高度计算不准确（无法包含margin）
 */

export const virtualListProps = {
  /**
   * 默认滚动到第几项
   */
  defaultStartIndex: {
    type: Number,
    default: 0,
  },
  /**
   * 列表数据，如果数据存在动态追加，需要每一项需包含唯一ID
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
   * 不定高时，每一项的默认高度
   */
  defaultItemSize: {
    type: Number,
    default: 80,
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
