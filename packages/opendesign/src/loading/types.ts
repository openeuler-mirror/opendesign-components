import { ExtractPropTypes } from 'vue';
import { layerProps } from '../layer/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { maskClose, ...extractProps } = layerProps;

export const loadingProps = {
  ...extractProps,
  /**
   * loading文本
   */
  label: {
    type: String,
  },
  /**
   * loading图标
   */
  icon: {
    type: Object,
  },
  /**
   * loading图标是否旋转
   */
  iconRotating: {
    type: Boolean,
  },
};

export type LoadingPropsT = ExtractPropTypes<typeof loadingProps>;
