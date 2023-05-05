import { ExtractPropTypes, PropType } from 'vue';
import type { DirectionT } from '../_shared/global';

export const DividerVariantTypes = ['solid', 'dashed', 'dotted'] as const;
export type DividerVariantT = typeof DividerVariantTypes[number];

export const dividerProps = {
  /**
   * 分割线类型 DividerVariantT
   */
  variant: {
    type: String as PropType<DividerVariantT>,
    default: 'solid',
  },
  /**
   * 分割线方向 DirectionT
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * 自定义内容位置
   */
  labelPosition: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center',
  },
};

export type DividerPropsT = ExtractPropTypes<typeof dividerProps>;
