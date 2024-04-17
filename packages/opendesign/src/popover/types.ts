import { ExtractPropTypes } from 'vue';

import { popupProps } from '../popup/types';

popupProps.trigger.default = 'hover';
popupProps.anchor.default = true;
popupProps.offset.default = 8;

export const popoverProps = {
  ...popupProps,
};

export type PopoverPropsT = ExtractPropTypes<typeof popoverProps>;
