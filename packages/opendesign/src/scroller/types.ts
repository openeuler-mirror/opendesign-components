import { ExtractPropTypes, PropType, ComponentPublicInstance } from 'vue';
export type ScrollerDirection = 'x' | 'y';

export const ScrollerSizeTypes = ['medium', 'small'] as const;
export type ScrollerSizeT = (typeof ScrollerSizeTypes)[number];

export const scrollerProps = {
  /**
   * 禁用横向滚动
   */
  disabledX: {
    type: Boolean,
  },
  /**
   * 禁用纵向滚动
   */
  disabledY: {
    type: Boolean,
  },
  /**
   * 滚动容器,支持body、元素ref、HTMLElement
   */
  target: {
    type: [String, Object] as PropType<string | ComponentPublicInstance | HTMLElement | null>,
    default: null,
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
    type: [String, Array] as PropType<string | any[]>,
  },
};

export type ScrollerPropsT = ExtractPropTypes<typeof scrollerProps>;

export const scrollbarProps = {
  /**
   * 滚动条方向 h：横向 v: 纵向
   */
  direction: {
    type: String as PropType<'x' | 'y'>,
    default: 'y',
  },
  /**
   * 滚动bar宽度占总宽度
   */
  thumbRate: {
    type: Number,
  },
  /**
   * 滚动bar滚动位置百分比
   */
  offsetRate: {
    type: Number,
    default: 0,
  },
  /**
   * 点击track一次，滚动一屏
   */
  notStepJump: {
    type: Boolean,
  },
  /**
   * 滚动条尺寸大小
   */
  size: {
    type: String as PropType<ScrollerSizeT>,
    default: 'medium',
  },
};
export type ScrollbarPropsT = ExtractPropTypes<typeof scrollbarProps>;
