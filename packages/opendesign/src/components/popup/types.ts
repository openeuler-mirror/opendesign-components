import { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue';

export type PopupPositionT = 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb';

export type PopupTriggerT = 'hover' | 'click' | 'focus' | 'contextmenu' | 'none';

export const popupProps = {
  /**
   * 弹出位置
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * 触发事件
   * 'hover','click','focus','contextMenu'
   */
  trigger: {
    type: [String, Array<String>] as PropType<PopupTriggerT | PopupTriggerT[]>,
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
   * 是否可见
   * v-model
   */
  visible: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement>,
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
    type: String,
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
   * Popup在hover时是否不消失，当trigger包含hover时有效
   */
  statyOnHoverin: {
    type: Boolean,
    default: true,
  },
  /**
   * popup wrap自定义class
   */
  wrapClass: {
    type: String,
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
};

export type PopupPropsT = ExtractPropTypes<typeof popupProps>;
