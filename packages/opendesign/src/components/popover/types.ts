import { ExtractPropTypes } from 'vue';

import { popupProps } from '../popup/types';

const { position, trigger, target, visible, wrapper, unmountOnHide } = popupProps;

export const popoverProps = {
  position,
  trigger,
  target,
  visible,
  wrapper,
  unmountOnHide,
  /**
   * 距离触发元素的偏移量
   */
  offset: {
    type: Number,
    default: 8,
  },
};

export type PopupPropsT = ExtractPropTypes<typeof popoverProps>;