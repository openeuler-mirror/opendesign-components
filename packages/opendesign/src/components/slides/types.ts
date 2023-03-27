import { ExtractPropTypes, PropType } from 'vue';

export const slidesProps = {
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
  arrow: {
    type: Boolean,
    default: true,
  },
  /**
   * 设置切换箭头容器类
   */
  arrowWrapClass: {
    type: String,
  },
  /**
   * 是否显示指示器
   */
  indicator: {
    type: Boolean,
    default: true,
  },
  /**
   * 设置指示器容器类
   */
  indicatorWrapClass: {
    type: String,
  },
  /**
   * 是否无限切换，使用下一张补位
   */
  loop: {
    type: Boolean,
  },
};

export type SlidesPropsT = ExtractPropTypes<typeof slidesProps>;
