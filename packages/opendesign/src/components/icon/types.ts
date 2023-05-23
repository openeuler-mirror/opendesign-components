import { ExtractPropTypes, PropType, Component } from 'vue';
import { SizeT } from '../_shared/types';

export const iconProps = {
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * 按钮尺寸 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
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
};

export type IconPropsT = ExtractPropTypes<typeof iconProps>;
