import { ExtractPropTypes, PropType } from 'vue';

export const carouselProps = {
  /**
   * 激活索引 v-model
   */
  activeIndex: {
    type: Number,
  },
  /**
   * 样式类型
   */
  effect: {
    type: String as PropType<'gallery' | 'toggle'>,
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
  // 切换箭头的显示时机
  arrow: {
    type: String as PropType<'always' | 'hover' | 'never'>,
    default: 'hover',
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
  clickToSwitch: {
    type: Boolean,
  },
  /**
   * 是否手工初始化，用户调用instance.init()
   */
  manualInit: {
    type: Boolean,
  },
  /**
   * 自定义激活项的类
   */
  activeClass: {
    type: String,
  },
  /**
   * 是否在hover时暂停自动轮播
   */
  pauseOnHover: {
    type: Boolean,
  },
};

export type CarouselPropsT = ExtractPropTypes<typeof carouselProps>;
