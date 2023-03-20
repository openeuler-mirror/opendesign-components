import { ExtractPropTypes, PropType } from 'vue';
import type { DirectionT } from '../_shared/global';

export type DividerTypeT = 'solid' | 'dashed' | 'dotted';
export type DividerContentPositionT = 'left' | 'center' | 'right';

export const dividerProps = {
  /**
   * 分割线类型
   * 'solid' | 'dashed' | 'dotted'
   */
  type: {
    type: String as PropType<DividerTypeT>,
    default: 'solid',
  },
  /**
   * 分割线方向
   * 'h' | 'v'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * 自定义内容位置
   * 'left' | 'center' | 'right'
   */
  contentPosition: {
    type: String as PropType<DividerContentPositionT>,
    default: 'center',
  },
};

export type DividerPropsT = ExtractPropTypes<typeof dividerProps>;
