import { ExtractPropTypes } from 'vue';

export const radioProps = {
  /**
   * 单选框value
   */
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  /**
   * 单选框双向绑定值
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
   * 是否禁用
   */
  disabled: {
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

export type RadioPropsT = ExtractPropTypes<typeof radioProps>;
