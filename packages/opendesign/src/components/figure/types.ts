import { ExtractPropTypes } from 'vue';

export const figureProps = {
  /**
   * 地址
   */
  src: {
    type: String,
  },
  /**
   * 长宽比
   */
  ratio: {
    type: Number,
  },
  /**
   * 适配方式
   */
  position: {
    type: String,
    default: 'center'
  },
  /**
   * 适配方式
   */
  fit: {
    type: String,
    default: 'cover'
  },
  /**
   * img alt
   */
  alt: {
    type: String,
  },
  /**
   * 使用背景
   */
  background: {
    type: Boolean,
  },
};

export type FigurePropsT = ExtractPropTypes<typeof figureProps>;
