import type { Component, ExtractPropTypes, PropType, VNode } from 'vue';

export const MessageStatusTypes = ['info', 'success', 'warning', 'danger', 'loading'] as const;
export type MessageStatusT = (typeof MessageStatusTypes)[number];

export type MessagePositionT = 'top' | 'bottom';

export const messageProps = {
  /**
   * 消息是否可见 v-model
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 非受控模式，消息是否默认可见
   */
  defaultVisible: {
    type: Boolean,
    default: true,
  },
  /**
   * 状态 MessageStatusT
   */
  status: {
    type: String as PropType<MessageStatusT>,
    default: 'info',
  },
  /**
   * 预置背景（跟随状态）
   */
  colorful: {
    type: Boolean,
    default: false,
  },
  /**
   * 消息显示的持续时间，函数式调用时，默认值为3000
   */
  duration: {
    type: Number,
  },
  /**
   * 是否可手动关闭
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * 关闭前的钩子函数
   */
  beforeClose: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export const messageListProps = {
  /**
   * 消息列表位置 MessagePositionT
   */
  position: {
    type: String as PropType<MessagePositionT>,
    default: 'top',
  },
  /**
   * 消息列表销毁前的钩子函数
   */
  onDestory: {
    type: Function as PropType<() => void>,
  },
};

export type MessagePropsT = ExtractPropTypes<typeof messageProps>;
export type MessageListPropsT = ExtractPropTypes<typeof messageListProps>;

export type MessageParamsT = Partial<
  MessagePropsT & {
    content: string | VNode | Component;
    position: MessagePositionT;
    icon: VNode | Component;
    onDurationEnd: () => void;
    onClose: (ev?: MouseEvent) => void;
  }
>;
