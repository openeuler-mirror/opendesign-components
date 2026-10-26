import type { RoundT } from '../_utils/types';
import type { ExtractPropTypes, PropType } from 'vue';

export const SwitchSizeTypes = ['medium', 'small'] as const;
export type SwitchSizeT = (typeof SwitchSizeTypes)[number];

export const switchProps = {
  /**
   * @zh-CN 双向绑定值
   * @en-US Two-way binding value
   */
  modelValue: {
    type: [String, Number, Boolean],
    // type 类型校验中包含 Boolean 类型时，vue 会将 undefined 转化为 false，这将导致非受控模式判断出问题，因此显示指定 default: undefined
    default: undefined,
  },
  /**
   * @zh-CN 非受控状态时，默认是否选中
   * @en-US Default whether to select when uncontrolled
   * @default false
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 选中状态对应值
   * @en-US Value corresponding to selected state
   * @default true
   */
  checkedValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  /**
   * @zh-CN 未选中状态对应值
   * @en-US Value corresponding to unselected state
   * @default false
   */
  uncheckedValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  /**
   * @zh-CN 组件尺寸
   * @en-US Component size
   */
  size: {
    type: String as PropType<SwitchSizeT | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 圆角大小
   * @en-US Round size
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 是否处于加载状态
   * @en-US Is loading
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 状态改变前的钩子函数
   * @en-US Hook function before state change
   */
  beforeChange: {
    type: Function as PropType<(val: boolean) => Promise<boolean> | boolean>,
  },
};

export type SwitchPropsT = ExtractPropTypes<typeof switchProps>;
