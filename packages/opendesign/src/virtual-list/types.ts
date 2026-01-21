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
   * @zh-CN 默认滚动到第几项
   * @en-US Default scroll index
   * @default 0
   */
  defaultStartIndex: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 列表数据，如果数据存在动态追加，需要每一项需包含唯一ID
   * @en-US List data, if dynamic addition exists, each item must contain a unique ID
   */
  list: {
    type: Array<unknown>,
    required: true,
    default: () => [],
  },
  /**
   * @zh-CN 每一项的高度，如果每一项高度不一致或不确定（渲染时确定），则不传
   * @en-US The height of each item, if the height of each item is inconsistent or undetermined (determined at render time), do not pass
   */
  itemSize: {
    type: Number,
  },
  /**
   * @zh-CN 不定高时，每一项的默认高度
   * @en-US If the height of each item is not consistent, the default height of each item
   * @default 80
   */
  defaultItemSize: {
    type: Number,
    default: 80,
  },
  /**
   * @zh-CN 前后预留项，减少滚动式空白
   * @en-US Front and back reserved items, reducing scrolling blank
   * @default 1
   */
  buffer: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN scrollbar配置项
   * @en-US scrollbar configuration item
   * @default true
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
};
export type VirtualListPropsT = ExtractPropTypes<typeof virtualListProps>;
