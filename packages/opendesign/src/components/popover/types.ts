import { ExtractPropTypes } from 'vue';

import { popupProps } from '../popup/types';

const { position, trigger, target, visible, wrapper, unmountOnHide, anchorClass, wrapClass } = popupProps;

export const popoverProps = {
  position,
  trigger,
  target,
  visible,
  wrapper,
  unmountOnHide,
  anchorClass,
  wrapClass,
  /**
   * 距离触发元素的偏移量
   */
  offset: {
    type: Number,
    default: 8,
  },
  /**
   * 是否展示箭头
   */
  anchor: {
    type: Boolean,
    default: true,
  },
};

export type PopupPropsT = ExtractPropTypes<typeof popoverProps>;
