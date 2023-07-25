import { ExtractPropTypes } from 'vue';
import { popupProps } from '../../popup/types';

popupProps.trigger.default = 'click-outclick';
popupProps.position.default = 'bl';
popupProps.anchor.default = false;
popupProps.offset.default = 4;

export const innerPanelProps = {
  ...popupProps,
  /**
   * 下拉浮层是否响应式
   */
  noResponsive: {
    type: Boolean,
  },
};

export type InnerPanelProps = ExtractPropTypes<typeof innerPanelProps>;
