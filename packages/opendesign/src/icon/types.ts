import { ExtractPropTypes, PropType, Component } from 'vue';
export const iconProps = {
  /**
   * @zh-CN 图标组件
   * @en-US Icon component
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * @zh-CN 是否为按钮图标
   * @en-US Whether it is a button icon
   */
  button: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否为 loading 状态
   * @en-US Whether it is in loading state
   */
  loading: {
    type: Boolean,
  },
};

export type IconPropsT = ExtractPropTypes<typeof iconProps>;