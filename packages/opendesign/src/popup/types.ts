import { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue';

export const PopupPositionTypes = ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'] as const;
export type PopupPositionT = (typeof PopupPositionTypes)[number];

export const PopupTriggerTypes = ['none', 'click', 'click-outclick', 'hover', 'hover-outclick', 'focus', 'contextmenu'] as const;
export type PopupTriggerT = (typeof PopupTriggerTypes)[number];

export const popupProps = {
  /**
   * @zh-CN 是否可见，双向绑定值
   * @en-US Whether visible, bidirectional binding value.
   */
  visible: {
    type: Boolean,
  },
  /**
   * @zh-CN 弹出位置
   * @en-US Pop-up position.
   * @default 'top'
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * @zh-CN 触发事件
   * @en-US Trigger event.
   * @default 'click'
   */
  trigger: {
    type: [String, Array] as PropType<PopupTriggerT | PopupTriggerT[]>,
    default: 'click',
  },
  /**
   * @zh-CN 触发元素或组件
   * @en-US Trigger element or component.
   * @default null
   */
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 挂载容器，默认为body
   * @en-US Mount the container, with the default being body.
   * @default 'body'
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 距离触发对象的偏移量
   * @en-US The offset of the distance triggered object.
   * @default 0
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 距离viewport(屏幕)边缘偏移量
   * @en-US Offset from the edge of the viewport(screen).
   * @default 0
   */
  edgeOffset: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN hover事件延时触发的时间（毫秒）
   * @en-US The time (in milliseconds) for the hover event to be delayed and triggered.
   * @default 100
   */
  hoverDelay: {
    type: Number,
    default: 100,
  },
  /**
   * @zh-CN 是否当触发元素不可见时隐藏弹层
   * @en-US Whether to hide the bullet layer when the trigger element is invisible.
   * @default true
   */
  hideWhenTargetInvisible: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否计算锚点位置
   * @en-US Whether to calculate the anchor point position.
   * @default false
   */
  anchor: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 锚点自定义类名
   * @en-US Anchor point custom class name.
   * @default undefined
   */
  anchorClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * @zh-CN 是否在popup隐藏时卸载组件
   * @en-US Whether to uninstall the component when the popup is hidden.
   * @default true
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN popup挂载容器自定义类
   * @en-US popup mounts a custom container class.
   * @default undefined
   */
  wrapClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * @zh-CN popup挂载容器的内容体的自定义类
   * @en-US popup is a custom class for mounting the content body of a container.
   * @default undefined
   */
  bodyClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * @zh-CN popup最小宽度设置为触发元素宽度
   * @en-US The minimum width of popup is set to the width of the trigger element.
   * @default true
   */
  adjustMinWidth: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN popup宽度设置为触发元素宽度
   * @en-US The popup width is set to the width of the trigger element.
   * @default true
   */
  adjustWidth: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transitional name.
   * @default 'o-zoom-fade'
   */
  transition: {
    type: String,
    default: 'o-zoom-fade',
  },
  /**
   * @zh-CN 是否自动隐藏
   * @en-US Whether to hide automatically.
   * @default true
   */
  autoHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 显示前回调，根据返回值判断是否显示, false: 不显示； true|undefined: 显示
   * @en-US Before display the callback, determine whether to display based on the return value. false: No display. true|undefined: Display.
   */
  beforeShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 隐藏前回调，根据返回值判断是否隐藏，false: 不隐藏； true|undefined: 隐藏
   * @en-US Hide the callback before hiding. Determine whether to hide it based on the return value. false: Not hidden. true|undefined: Hidden.
   */
  beforeHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN popup是否自适应边缘
   * @en-US Is popup adaptive edge.
   * @default true
   */
  adaptive: {
    type: Boolean,
    default: true,
  },
};

export type PopupPropsT = ExtractPropTypes<typeof popupProps>;
