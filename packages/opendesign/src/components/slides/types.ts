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
    type: String as PropType<'carousel'|'switch'>,
    default: 'switch'
  },
  /**
   * 自动播放
   */
  autoPlay: {
    type: Boolean
  },
  /**
   * 自动播放间隔
   */
  interval: {
    type: Number,
    default: 5000
  },
};

export type SlidesPropsT = ExtractPropTypes<typeof slidesProps>;
