import { ExtractPropTypes, PropType } from 'vue';

export const carouselProps = {
  /**
   * @zh-CN 激活索引 (v-model)
   * @en-US Active index (v-model)
   */
  activeIndex: {
    type: Number,
  },
  /**
   * @zh-CN 切换效果
   * @en-US Switch effect
   * @default 'gallery'
   */
  effect: {
    type: String as PropType<'gallery' | 'toggle'>,
    default: 'gallery',
  },
  /**
   * @zh-CN 自动播放
   * @en-US Auto play
   */
  autoPlay: {
    type: Boolean,
  },
  /**
   * @zh-CN 播放间隔(ms)
   * @en-US Play interval(ms)
   * @default 5000
   * @default 5000
   */
  interval: {
    type: Number,
    default: 5000,
  },
  /**
   * @zh-CN 箭头显示时机
   * @en-US Arrow display timing
   * @default 'hover'
   */
  arrow: {
    type: String as PropType<'always' | 'hover' | 'never'>,
    default: 'hover',
  },
  /**
   * @zh-CN 箭头容器类
   * @en-US Arrow container class
   */
  arrowWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * @zh-CN 隐藏指示器
   * @en-US Hide indicator
   */
  hideIndicator: {
    type: Boolean,
  },
  /**
   * @zh-CN 指示器点击切换
   * @en-US Indicator click to switch
   */
  indicatorClick: {
    type: Boolean,
  },
  /**
   * @zh-CN 指示器容器类
   * @en-US Indicator container class
   */
  indicatorWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * @zh-CN 点击卡片切换
   * @en-US Click card to switch
   */
  clickToSwitch: {
    type: Boolean,
  },
  /**
   * @zh-CN 手动初始化，调用instance.init()
   * @en-US Manual initialization, call instance.init()
   */
  manualInit: {
    type: Boolean,
  },
  /**
   * @zh-CN 自定义激活类
   * @en-US Custom active class
   */
  activeClass: {
    type: String,
  },
  /**
   * @zh-CN 鼠标悬停时暂停自动切换
   * @en-US Pause auto switching when mouse hover
   */
  pauseOnHover: {
    type: Boolean,
  },
};

export type CarouselPropsT = ExtractPropTypes<typeof carouselProps>;
