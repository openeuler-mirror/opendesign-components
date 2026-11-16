import { ExtractPropTypes, PropType } from 'vue';

export const checkboxProps = {
  /**
   * @zh-CN 复选框value，会作为 modelValue 的值
   * @en-US Checkbox value, which will be the value of modelValue
   */
  value: {
    type: [String, Number],
    required: true as const,
  },
  /**
   * @zh-CN 复选框双向绑定值
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
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
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
  /**
   * @zh-CN 透传给内部原生 input 的属性对象（如 `aria-label` 等无障碍属性，键名用原生属性名 kebab-case）。
   * 根元素是 `<label :for>` 时插槽文本已提供可访问名称，仅需覆盖名称或补表单校验关联时传入
   * @en-US Attributes object forwarded to the native input (e.g. accessibility attributes like `aria-label`),
   * keyed by native attribute names (kebab-case). The root `<label :for>` already provides an accessible name
   * from the slot text; pass it only to override the name or attach form-validation associations
   * @since NEXT
   */
  inputProps: {
    type: Object as PropType<Record<string, string | number | boolean | undefined>>,
  },
};

export type CheckboxPropsT = ExtractPropTypes<typeof checkboxProps>;
