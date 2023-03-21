import { ExtractPropTypes } from 'vue';

export const slidesProps = {
  /**
   * 激活索引
   */
  activeIndex: {
    type: Number,
  },

};

export type SlidesPropsT = ExtractPropTypes<typeof slidesProps>;
