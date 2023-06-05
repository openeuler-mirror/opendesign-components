import { ExtractPropTypes } from 'vue';

export const optionProps = {
  /**
   * 显示文本
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * 值
   */
  value: {
    type: [String, Number],
    default: '',
  },
  /**
   * 禁用
   */
  disabled: {
    type: Boolean,
  },
};

export type OptionPropsT = ExtractPropTypes<typeof optionProps>;
