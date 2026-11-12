import { ExtractPropTypes, PropType, Component } from 'vue';
import { RoundT } from '../_utils/types';

export const buttonToggleProps = {
  /**
   * @zh-CN 双向绑定值，是否被选中
   * @en-US Bidirectional binding value, whether selected.
   * @default undefined
   */
  checked: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 非受控状态时，默认是否选中
   * @en-US Whether it is selected by default when in an uncontrolled state.
   * @default false
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 圆角值
   * @en-US Round.
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 前缀图标
   * @en-US Prefix icon.
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 无障碍标签，为独立使用的开关按钮提供可访问名称；父级（ORadioGroup 等）持语义时自动让位不输出
   * @en-US Accessibility label for standalone usage; yielded automatically when the host owns semantics
   * @since NEXT
   */
  ariaLabel: {
    type: String,
  },
};

export type ButtonToggleProps = ExtractPropTypes<typeof buttonToggleProps>;
