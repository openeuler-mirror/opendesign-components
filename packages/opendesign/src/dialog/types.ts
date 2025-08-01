import { ExtractPropTypes, PropType, Component } from 'vue';
import { layerProps } from '../layer/types';
import { ColorT, SizeT, VariantT, RoundT } from '../_utils/types';
import { BaseScrollerPropsT } from '../scrollbar';

export const DialogSizeTypes = ['exlarge', 'large', 'medium', 'small', 'auto'] as const;
export type DialogSizeT = (typeof DialogSizeTypes)[number];

export interface DialogActionT {
  id: string | number;
  color?: ColorT;
  variant?: VariantT;
  size?: SizeT;
  label?: string;
  round?: RoundT;
  icon?: Component;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export const dialogProps = {
  ...layerProps,
  /**
   * @zh-CN 是否隐藏对话框的关闭按钮
   * @en-US Whether to hide the close button of the dialog
   */
  hideClose: {
    type: Boolean,
  },
  /**
   * @zh-CN 对话框尺寸
   * @en-US Dialog size
   */
  size: {
    type: String as PropType<DialogSizeT>,
    default: 'auto',
  },

  /**
   * @zh-CN 对话框底部按钮
   * @en-US Dialog bottom button
   */
  actions: {
    type: Array as PropType<DialogActionT[]>,
  },
  /**
   * @zh-CN 是否禁用响应式
   * @en-US Whether to disable responsive
   */
  noResponsive: {
    type: Boolean,
  },
  /**
   * @zh-CN 移动端是否渲染为半屏（宽度占满，高度占一半）
   * @en-US Whether to render as half screen (width full, height half) on mobile phone
   */
  phoneHalfFull: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否使用scrollbar，值为 false 不使用，值为 true 或 scrollbar 的配置对象则使用
   * @en-US Whether to use scrollbar, value false not use, value true or scrollbar configuration object to use
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
