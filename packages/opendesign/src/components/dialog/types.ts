import { ExtractPropTypes, PropType } from 'vue';
import { layerProps } from '../layer/types';
import { ColorT, SizeT, VariantT, RoundT } from '../_utils/types';

export const DialogSizeTypes = ['exlarge', 'large', 'medium', 'small', 'auto'] as const;
export type DialogSizeT = (typeof DialogSizeTypes)[number];

export interface DialogActionT {
  id: string | number;
  color?: ColorT;
  variant?: VariantT;
  size?: SizeT;
  label: string;
  round?: RoundT;
  onClick: () => void;
}

export interface DialogScrollerT {
  showType?: 'auto' | 'always' | 'hover';
  size?: 'medium' | 'small';
  disabledX?: boolean;
  disabledY?: boolean;
}

export const dialogProps = {
  ...layerProps,
  /**
   * 是否隐藏可以关闭
   */
  hideClose: {
    type: Boolean,
  },
  /**
   * 弹窗尺寸
   */
  size: {
    type: String as PropType<DialogSizeT>,
    default: 'auto',
  },
  /**
   * 弹窗底部按钮
   */
  actions: {
    type: Array as PropType<DialogActionT[]>,
  },
  /**
   * 是否响应式
   */
  noResponsive: {
    type: Boolean,
  },
  /**
   * 是否使用scroller
   */
  scroller: {
    type: [Boolean, Object] as PropType<boolean | DialogScrollerT>,
    default: true,
  },
};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
