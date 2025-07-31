import { ExtractPropTypes, PropType } from 'vue';

export const collapseProps = {
  /**
   * @zh-CN 是否开启手风琴模式
   * @en-US Whether to enable accordion mode
   * @default false
   */
  accordion: {
    type: Boolean,
    default: false,
  },

  /**
   * @zh-CN 展开的面板，双向绑定值
   * @en-US Expanded panel, two-way binding value
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * @zh-CN 非受控模式时，默认展开的面板值
   * @en-US Default value when not controlled
   */
  defaultValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
};

export const collapseItemProps = {
  /**
   * @zh-CN 折叠面板value
   * @en-US Collapse panel value
   */
  value: {
    type: [String, Number],
    required: true as const,
  },
  /**
   * @zh-CN 折叠面板标题
   * @en-US Collapse panel title
   */
  title: {
    type: String,
  },
};

export type CollapsePropsT = ExtractPropTypes<typeof collapseProps>;
export type CollapseItemPropsT = ExtractPropTypes<typeof collapseItemProps>;
