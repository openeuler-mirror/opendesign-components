import { ExtractPropTypes, PropType } from 'vue';

import { popupProps } from '../popup/types';

export const popoverProps = {
  ...popupProps,
  /**
   * 锚点自定义class
   */
  anchorClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * popup wrap自定义class
   */
  wrapClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
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
