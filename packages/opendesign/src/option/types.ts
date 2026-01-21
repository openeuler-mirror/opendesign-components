import { ExtractPropTypes } from 'vue';

export const optionProps = {
  /**
   * @zh-CN 选项显示文本
   * @en-US The option displays text.
   * @default ''
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * @zh-CN 选项选中后的值
   * @en-US The value after the option is selected.
   * @default ''
   */
  value: {
    type: [String, Number],
    default: '',
  },
  /**
   * @zh-CN 支持选项禁用
   * @en-US Disabled support options.
   */
  disabled: {
    type: Boolean,
  },
};

export type OptionPropsT = ExtractPropTypes<typeof optionProps>;
