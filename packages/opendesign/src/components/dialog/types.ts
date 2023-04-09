import { ExtractPropTypes } from 'vue';
import { layerProps } from '../layer/types';
export const dialogProps = {
  ...layerProps,
  /**
   * 是否隐藏可以关闭
   */
  hideClose: {
    type: Boolean,
  },
};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
