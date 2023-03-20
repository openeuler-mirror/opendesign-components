import type { ExtractPropTypes, PropType } from 'vue';
import { ColorT } from '../_shared/global';

export const messageProps = {
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  content: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 3000,
  },
  onClose: {
    type: Function as PropType<() => void>,
  },
};

export type MessagePropsT = ExtractPropTypes<typeof messageProps>;

export type MessagePositionT = 'top' | 'bottom';

export type MessageParamsT = Partial<MessagePropsT & { position: MessagePositionT }>;
