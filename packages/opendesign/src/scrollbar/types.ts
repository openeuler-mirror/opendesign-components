import { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue';
export type ScrollerDirection = 'x' | 'y';

export const ScrollerSizeTypes = ['medium', 'small'] as const;
export type ScrollerSizeT = (typeof ScrollerSizeTypes)[number];

export const baseScrollarProps = {
  /**
   * @zh-CN 隐藏横向滚动条
   * @en-US Hide the horizontal scroll bar.
   */
  disabledX: {
    type: Boolean,
    required: false as const,
  },
  /**
   * @zh-CN 隐藏纵向滚动条
   * @en-US Hide the vertical scroll bar.
   */
  disabledY: {
    type: Boolean,
  },
  /**
   * @zh-CN 滚动条在停止滚动多长时间后隐藏, 单位：ms
   * @en-US How long after the scroll bar stops scrolling is hidden, unit: ms.
   * @default 600
   */
  duration: {
    type: Number,
    default: 600,
  },
  /**
   * @zh-CN 滚动条显示控制
   * always：一直显示
   * auto: 滚动中、滚动后hover滚动条、拖拽时显示
   * hover: 滚动条hover时显示
   * never: 不显示滚动条
   * @en-US The scroll bar displays the control.
   * always：Always displayed.
   * auto: The hover bar is displayed while scrolling, after scrolling, and when dragging.
   * hover: It is displayed when the scroll bar hovers.
   * never: The scroll bar is not displayed.
   * @default 'auto'
   */
  showType: {
    type: String as PropType<'auto' | 'always' | 'hover' | 'never'>,
    default: 'auto',
  },
  /**
   * @zh-CN 滚动条尺寸大小
   * @en-US The size of the scroll bar.
   * @default 'medium'
   */
  size: {
    type: String as PropType<ScrollerSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN showType = always时，是否根据滚动容器滚动高度变化自动刷新滚动条
   * @en-US When showType = always, does the scroll bar automatically refresh according to the change in the scroll height of the scroll container.
   */
  autoUpdateOnScrollSize: {
    type: Boolean,
  },
  /**
   * @zh-CN 自定义滚动条类
   * @en-US Custom scroll bar class.
   */
  barClass: {
    type: String,
  },
};
export type BaseScrollerPropsT = ExtractPropTypes<typeof baseScrollarProps>;

export const scrollerProps = {
  ...baseScrollarProps,
  /**
   * @zh-CN 滚动容器类
   * @en-US Rolling container class.
   */
  wrapClass: {
    type: [String, Array, Object] as PropType<string | any[] | object>,
  },
};

export type ScrollerPropsT = ExtractPropTypes<typeof scrollerProps>;

export const scrollbarProps = {
  ...baseScrollarProps,
  /**
   * @zh-CN 滚动关联目标容器,支持body、元素ref、HTMLElement
   * @en-US Scroll to associate the target container, supporting body, element ref, and HTMLElement.
   * @default null
   */
  target: {
    type: [String, Object] as PropType<HTMLElement | ComponentPublicInstance | string | null>,
    default: null,
  },
};
export type ScrollbarPropsT = ExtractPropTypes<typeof scrollbarProps>;
