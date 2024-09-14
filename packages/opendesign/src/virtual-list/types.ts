import { ExtractPropTypes, PropType } from 'vue';
import { BaseScrollerPropsT } from '../scrollbar';

export const virtualListProps = {
  /**
   * 禁用横向滚动
   */
  list: {
    type: Array<any>,
    required: true,
  },
  itemSize: {
    type: Number,
  },
  defaultStartIndex: {
    type: Number,
    default: 0,
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
