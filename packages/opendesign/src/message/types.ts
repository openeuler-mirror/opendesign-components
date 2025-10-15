import type { Component, ExtractPropTypes, PropType, VNode, ComponentPublicInstance } from 'vue';

export const MessageStatusTypes = ['info', 'success', 'warning', 'danger', 'loading'] as const;
export type MessageStatusT = (typeof MessageStatusTypes)[number];

export type MessagePositionT = 'top' | 'bottom';

export const messageProps = {
  /**
   * @zh-CN 消息是否可见 v-model
   * @en-US Message is visible v-model
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 非受控模式，消息是否默认可见
   * @en-US Non-controlled mode, message is visible by default
   * @default true
   */
  defaultVisible: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 状态
   * @en-US Status
   * @default 'info'
   */
  status: {
    type: String as PropType<MessageStatusT>,
    default: 'info',
  },
  /**
   * @zh-CN 是否是彩色背景（跟随 status 变化）
   * @en-US Is colored background (follows the status change)
   * @default false
   */
  colorful: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 消息显示的持续时间（单位ms）。未设置或小于等于0时，消息将不会自动关闭
   * @en-US The duration for which the message is displayed (unit: ms). If not set or less than or equal to 0, the message will not close automatically
   */
  duration: {
    type: Number,
  },
  /**
   * @zh-CN 是否可手动关闭
   * @en-US Whether to manually close
   * @default false
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 关闭前的钩子函数
   * @en-US Hook function before closing
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
  onDestroy: {
    type: Function as PropType<() => void>,
  },
};

export type MessagePropsT = ExtractPropTypes<typeof messageProps>;
export type MessageListPropsT = ExtractPropTypes<typeof messageListProps>;

export type MessageParamsT = Partial<
  MessagePropsT & {
    content: string | VNode | Component;
    position: MessagePositionT;
    targetAlign?: 'center' | 'left' | 'right';
    icon: VNode | Component;
    onDurationEnd: () => void;
    onClose: (ev?: MouseEvent) => void;
  }
>;
