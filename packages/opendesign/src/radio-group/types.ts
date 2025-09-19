import { ExtractPropTypes, PropType } from 'vue';
import { DirectionT } from '../_utils/types';

export const radioGroupProps = {
  /**
   * @zh-CN 单选框组双向绑定值
   * @en-US Two-way binding values for radio box groups.
   */
  modelValue: {
    type: [String, Number, Boolean],
  },
  /**
   * @zh-CN 非受控状态时，单选框组默认值
   * @en-US The default value of the radio box group in an uncontrolled state.
   * @default ''
   */
  defaultValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  /**
   * @zh-CN 单选框组是否禁用
   * @en-US Whether the radio box group is disabled.
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 单选框组方向
   * @en-US Direction of the radio box group.
   * @default 'h'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
};

export type RadioGroupPropsT = ExtractPropTypes<typeof radioGroupProps>;
