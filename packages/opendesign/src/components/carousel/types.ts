import { ExtractPropTypes, PropType } from 'vue';

export const carouselProps = {
  /**
   * 激活索引
   */
  activeIndex: {
    type: Number,
  },
  /**
   * 样式类型
   */
  type: {
    type: String as PropType<'gallery'>,
    default: 'gallery',
  },
  /**
   * 自动播放
   */
  autoPlay: {
    type: Boolean,
  },
  /**
   * 自动播放间隔
   */
  interval: {
    type: Number,
    default: 5000,
  },
  /**
   * 是否显示切换箭头
   */
  hideArrow: {
    type: Boolean,
  },
  /**
   * 设置切换箭头容器类
   */
  arrowWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * 不显示指示器
   */
  hideIndicator: {
    type: Boolean,
  },
  /**
   * 指示器点击切换
   */
  indicatorClick: {
    type: Boolean,
  },
  /**
   * 设置指示器容器类
   */
  indicatorWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * 点击卡片切换到当前
   */
  clickToActive: {
    type: Boolean,
  },
  /**
   * 是否手工初始化，用户调用instance.init()
   */
  manualInit: {
    type: Boolean,
  },
};

export type CarouselPropsT = ExtractPropTypes<typeof carouselProps>;
