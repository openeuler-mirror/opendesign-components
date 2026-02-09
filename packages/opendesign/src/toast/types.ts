import type { ExtractPropTypes, PropType, ComponentPublicInstance, VNode, Component } from 'vue';

export enum Duration {
  NORMAL = 2000,
  LONG = 3500,
}

export type ToastPositionT = 'top' | 'bottom' | 'center';

export const toastProps = {
  /**
   * @zh-CN 消息是否可见
   * @en-US Message is visible.
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
   * @zh-CN 提示信息
   * @en-US Instructional message.
   */
  message: {
    type: String,
  },
  /**
   * @zh-CN 持续时间
   * @en-US Duration.
   */
  duration: {
    type: Number,
  },
  /**
   * @zh-CN 长提示
   * @en-US Long reminder.
   */
  long: {
    type: Boolean,
  },
  /**
   * @zh-CN 定位方向
   * @en-US Determine the direction.
   */
  position: {
    type: String as PropType<ToastPositionT>,
    default: 'bottom',
  },
  /**
   * @zh-CN 关闭前的钩子函数
   * @en-US Hook function before closing
   */
  beforeClose: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
} as const;

export const toastListProps = {
  /**
   * @zh-CN 消息列表位置
   * @en-US Position.
   */
  position: {
    type: String as PropType<ToastPositionT>,
    default: 'bottom',
  },
  /**
   * @zh-CN 消息列表销毁前的钩子函数
   * @en-US Hook function before the destruction of the message list.
   */
  onDestroy: {
    type: Function as PropType<() => void>,
  },
} as const;

export type ToastPropsT = ExtractPropTypes<typeof toastProps>;
export type ToastListPropsT = ExtractPropTypes<typeof toastListProps>;

export type ToastParamsT = Partial<
  ToastPropsT & {
    content: string | VNode | Component;
    position: ToastPositionT;
    targetOffset: number;
    targetAlign: 'center' | 'left' | 'right';
    onDurationEnd: () => void;
    onClose: (ev?: MouseEvent) => void;
  }
>;
