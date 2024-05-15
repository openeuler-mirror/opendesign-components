import { ExtractPropTypes, PropType } from 'vue';

export const checkboxProps = {
  /**
   * 多选框value
   */
  value: {
    type: [String, Number],
    required: true,
  },
  /**
   * 多选框双向绑定值
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * 非受控状态时，默认是否选中
   */
  defaultChecked: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否为半选状态
   */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /**
   * input id
   */
  inputId: {
    type: String,
  },
};

export type CheckboxPropsT = ExtractPropTypes<typeof checkboxProps>;
