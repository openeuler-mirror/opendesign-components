import { ExtractPropTypes, PropType } from 'vue';

export const checkboxProps = {
  /**
   * @zh-CN 多选框value，会作为 modelValue 的值
   * @en-US Checkbox value, which will be the value of modelValue
   */
  value: {
    type: [String, Number],
    required: true as const,
  },
  /**
   * @zh-CN 多选框双向绑定值
   * @en-US Checkbox two-way binding value
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * @zh-CN 非受控状态时，默认是否选中
   * @en-US Default checked when uncontrolled
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否半选
   * @en-US Whether to select half
   */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 输入框的 id
   * @en-US The id of the input box
   */
  inputId: {
    type: String,
  },
};

export type CheckboxPropsT = ExtractPropTypes<typeof checkboxProps>;
