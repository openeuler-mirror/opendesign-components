import { ExtractPropTypes, PropType, Component } from 'vue';
export const iconProps = {
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * 按钮图标
   */
  button: {
    type: Boolean,
  },
  /**
   * 禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 是否为loading状态
   */
  loading: {
    type: Boolean,
  },
};

export type IconPropsT = ExtractPropTypes<typeof iconProps>;
