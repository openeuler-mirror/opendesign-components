import { ExtractPropTypes, PropType, ComponentPublicInstance, Ref } from 'vue';
export type ScrollerDirection = 'x' | 'y';

export const ScrollerSizeTypes = ['medium', 'small'] as const;
export type ScrollerSizeT = (typeof ScrollerSizeTypes)[number];

export const scrollerProps = {
  /**
   * 禁用横向滚动
   */
  disabledX: {
    type: Boolean,
    required: false,
  },
  /**
   * 禁用纵向滚动
   */
  disabledY: {
    type: Boolean,
  },

  /**
   * 滚动条在停止滚动多长时间后隐藏, ms
   */
  duration: {
    type: Number,
    default: 600,
  },
  /**
   * 滚动条显示控制
   * always：一直显示
   * auto: 滚动中、滚动后hover滚动条、拖拽时显示
   * hover: 滚动条hover时显示
   * never: 不显示滚动条
   */
  showType: {
    type: String as PropType<'auto' | 'always' | 'hover' | 'never'>,
    default: 'auto',
  },
  /**
   * 滚动条尺寸大小
   */
  size: {
    type: String as PropType<ScrollerSizeT>,
    default: 'medium',
  },
  /**
   * 滚动容器类
   */
  wrapClass: {
    type: [String, Array, Object] as PropType<string | any[] | object>,
  },
};

export type ScrollerPropsT = ExtractPropTypes<typeof scrollerProps>;

export const scrollbarProps = {
  ...scrollerProps,
  /**
   * 滚动关联目标容器,支持body、元素ref、HTMLElement
   */
  target: {
    type: [String, Object] as PropType<Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string>,
    default: null,
  },
};
export type ScrollbarPropsT = ExtractPropTypes<typeof scrollbarProps>;
