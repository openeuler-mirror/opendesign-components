import { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue';

export const PopupPositionTypes = ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'] as const;
export type PopupPositionT = (typeof PopupPositionTypes)[number];

export const PopupTriggerTypes = ['hover', 'click', 'focus', 'contextmenu', 'none', 'hover-outclick'] as const;
export type PopupTriggerT = (typeof PopupTriggerTypes)[number];

export const popupProps = {
  /**
   * 是否可见
   * v-model
   */
  visible: {
    type: Boolean,
  },
  /**
   * 弹出位置 PopupPositionT
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * 触发事件 PopupTriggerT | PopupTriggerT[]
   */
  trigger: {
    type: [String, Array] as PropType<PopupTriggerT | PopupTriggerT[]>,
    default: 'hover',
  },
  /**
   * 触发元素或组件
   */
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * 距离target偏移量
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * 距离容器（如屏幕）边缘偏移量
   */
  edgeOffset: {
    type: Number,
    default: 0,
  },
  /**
   * hover事件延时触发的时间（毫秒）
   */
  hoverDelay: {
    type: Number,
    default: 100,
  },
  /**
   * 是否当触发元素不可见时隐藏弹层
   */
  hideWhenTargetInvisible: {
    type: Boolean,
    default: true,
  },
  /**
   * 锚点自定义class
   */
  anchorClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * 是否在popup隐藏时unmout
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * popup wrap自定义class
   */
  wrapClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: undefined,
  },
  /**
   * popup最小宽度设置为触发元素宽度
   */
  adjustMinWidth: {
    type: Boolean,
    default: true,
  },
  /**
   * popup宽度设置为触发元素宽度
   */
  adjustWidth: {
    type: Boolean,
    default: true,
  },
  /**
   * 过渡名称
   */
  transition: {
    type: String,
    default: 'o-zoom-fade',
  },
  /**
   * 是否自动隐藏
   */
  autoHide: {
    type: Boolean,
    default: true,
  },
  /**
   * 显示前回调，根据返回值判断是否显示, false: 不显示； true|undefined: 显示
   */
  beforeShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * 隐藏前回调，根据返回值判断是否隐藏，false: 不隐藏； true|undefined: 隐藏
   */
  beforeHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export type PopupPropsT = ExtractPropTypes<typeof popupProps>;
