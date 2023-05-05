import type { Component, ExtractPropTypes, PropType } from 'vue';

export const MessageStatusTypes = ['info', 'success', 'warning', 'danger'] as const;
export type MessageStatusT = typeof MessageStatusTypes[number];

export const messageProps = {
  status: {
    type: String as PropType<MessageStatusT>,
    default: 'info',
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

export type MessageParamsT = Partial<MessagePropsT & { position: MessagePositionT; icon: Component }>;
