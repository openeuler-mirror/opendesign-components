import { ExtractPropTypes } from 'vue';

export const radioProps = {
  /**
   * @zh-CN 单选框value
   * @en-US Radio box value.
   */
  value: {
    type: [String, Number, Boolean],
    required: true as const,
  },
  /**
   * @zh-CN 单选框双向绑定值
   * @en-US Two-way binding values for single-choice boxes.
   */
  modelValue: {
    type: [String, Number, Boolean],
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
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 用于关联label元素与input元素
   * @en-US Used to associate the label element with the input element.
   */
  inputId: {
    type: String,
  },
};

export type RadioPropsT = ExtractPropTypes<typeof radioProps>;
