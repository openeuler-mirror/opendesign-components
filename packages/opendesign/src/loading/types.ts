import { ExtractPropTypes } from 'vue';
import { layerProps } from '../layer/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { maskClose, ...extractProps } = layerProps;

export const loadingProps = {
  ...extractProps,
  /**
   * @zh-CN loading文本
   * @en-US loading text
   */
  label: {
    type: String,
  },
  /**
   * @zh-CN 自定义loading图标
   * @en-US Custom loading icon
   */
  icon: {
    type: Object,
  },
  /**
   * @zh-CN 自定义loading图标是否旋转
   * @en-US Whether the custom loading icon is rotating
   */
  iconRotating: {
    type: Boolean,
  },
};

export type LoadingPropsT = ExtractPropTypes<typeof loadingProps>;
