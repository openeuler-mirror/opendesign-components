import { ExtractPropTypes, PropType } from 'vue';
import type { DirectionT } from '../_utils/types';

export const DividerVariantTypes = ['solid', 'dashed', 'dotted'] as const;
export type DividerVariantT = (typeof DividerVariantTypes)[number];

export const dividerProps = {
  /**
   * @zh-CN 分割线形状
   * @en-US Divider shape
   * @default 'solid'
   */
  variant: {
    type: String as PropType<DividerVariantT>,
    default: 'solid',
  },
  /**
   * @zh-CN 分割线方向
   * @en-US Divider direction
   * @default 'h'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * @zh-CN 分割线标签位置
   * @en-US Divider label position
   * @default 'center'
   */
  labelPosition: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center',
  },
  /**
   * @zh-CN 是否使用深色
   * @en-US Whether to use dark
   * @default false
   */
  darker: {
    type: Boolean,
    default: false,
  },
};

export type DividerPropsT = ExtractPropTypes<typeof dividerProps>;
