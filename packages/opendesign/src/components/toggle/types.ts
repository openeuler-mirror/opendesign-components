import { ExtractPropTypes, PropType, Component } from 'vue';
import { RoundT } from '../_shared/types';

export const buttonToggleProps = {
  /**
   * 双向绑定值，是否被选中
   */
  checked: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 前缀图标
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
};

export type ButtonToggleProps = ExtractPropTypes<typeof buttonToggleProps>;
