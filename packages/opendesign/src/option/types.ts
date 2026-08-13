import { ExtractPropTypes, PropType } from 'vue';

export const optionProps = {
  /**
   * @zh-CN 选项显示文本
   * @en-US Option display text
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
  /**
   * @zh-CN 是否半选
   * @en-US Whether to select half
   */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 原始选项数据（数据驱动模式下由 OSelect 透传）
   * @en-US Raw option data (forwarded by OSelect in data-driven mode)
   * @description 携带 options prop 中的所有自定义字段（如 icon、iconColor 等），
   * 供 renderLabel / #option-label 访问；插槽模式下不传，OOption 内部从 label/value/disabled 重建
   * @since NEXT
   */
  raw: {
    type: Object as PropType<Record<string, unknown>>,
    default: undefined,
  },
};

export type OptionPropsT = ExtractPropTypes<typeof optionProps>;
