import type { RoundT } from '../_utils/types';
import type { ExtractPropTypes, PropType } from 'vue';

export const SwitchSizeTypes = ['medium', 'small'] as const;
export type SwitchSizeT = (typeof SwitchSizeTypes)[number];

export const switchProps = {
  /**
   * 双向绑定值
   */
  modelValue: {
    type: [String, Number, Boolean],
  },
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * 选中状态对应值
   */
  checkedValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  /**
   * 未选中状态对应值
   */
  uncheckedValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  /**
   * 开关尺寸 SwitchSizeT
   */
  size: {
    type: String as PropType<SwitchSizeT>,
    default: 'medium',
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否加载中
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 状态改变前的钩子函数
   */
  beforeChange: {
    type: Function as PropType<(val: boolean) => Promise<boolean> | boolean>,
  },
};

export type SwitchPropsT = ExtractPropTypes<typeof switchProps>;
