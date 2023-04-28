import { ExtractPropTypes, PropType, ComponentPublicInstance } from 'vue';
export type ScrollerDirection = 'h' | 'v';

export const scrollerProps = {
  /**
   * 按钮类型：PaginationVariantT
   */
  scrollX: {
    type: Boolean,
    default: true,
  },
  /**
   * 按钮类型：PaginationVariantT
   */
  scrollY: {
    type: Boolean,
    default: true,
  },
  /**
   * 滚动容器
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
   * 滚动条在停止滚动多长时间后隐藏, ms
   */
  autoHide: {
    type: Boolean,
    default: true,
  },
  /**
   * 滚动条显示控制
   * always：一直显示
   * auto: 滚动中、滚动后hover滚动条、拖拽时显示
   * hover: 滚动条hover时显示
   */
  showType: {
    type: String as PropType<'auto' | 'always' | 'hover'>,
    default: 'auto',
  },
  /**
   * 滚动条尺寸大小
   */
  size: {
    type: String as PropType<'medium' | 'small'>,
    default: 'medium',
  },
};

export type ScrollerPropsT = ExtractPropTypes<typeof scrollerProps>;

export const scrollbarProps = {
  /**
   * 滚动条方向 h：横向 v: 纵向
   */
  direction: {
    type: String as PropType<'h' | 'v'>,
    default: 'v',
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
    type: String as PropType<'medium' | 'small'>,
    default: 'medium',
  },
};
export type ScrollbarPropsT = ExtractPropTypes<typeof scrollbarProps>;
