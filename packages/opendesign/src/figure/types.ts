import { ExtractPropTypes, PropType } from 'vue';

export const figureProps = {
  /**
   * 地址
   */
  src: {
    type: String,
    required: true,
  },
  /**
   * 长宽比
   */
  ratio: {
    type: Number,
  },
  /**
   * 填充方式 cover | contain | fill | none | scale-down
   */
  fit: {
    type: String,
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
  /**
   * 可hover
   */
  hoverable: {
    type: Boolean,
  },
  /**
   * 链接跳转
   */
  href: {
    type: String,
  },
  /**
   * 预置随机多彩背景
   */
  colorful: {
    type: Boolean,
  },
  /**
   * 预览
   */
  preview: {
    type: Boolean,
  },
  /**
   * 支持通过实例接口调用预览
   */
  lazyPreiew: {
    type: Boolean,
  },
  /**
   * 视频预览图
   */
  videoPoster: {
    type: Boolean,
  },
  /**
   * 关闭预览方式
   */
  previewClose: {
    type: String as PropType<'button' | 'none' | 'mask' | 'mask-button'>,
    default: 'mask',
  },
};

export type FigurePropsT = ExtractPropTypes<typeof figureProps>;
