import { ExtractPropTypes, PropType } from 'vue';

type PreviewCloseType = 'none' | 'button' | 'mask' | 'body';

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
  lazyPreview: {
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
    type: [String, Array] as PropType<PreviewCloseType | PreviewCloseType[]>,
  },
  /**
   * 图片懒加载
   * [false]: 立即加载
   * [true]: 启用懒加载，根据与视口的位置关系判断是否加载图片
   * 1. background为false时，使用原生img loading=lazy判断是否加载
   * 2. background为true时，使用IntersectionObserver检测是否进入视口，加载图片
   * [IntersectionObserverInit]: { root, rootMargin, threshold }，指定使用IntersectionObserver检测是否进入视口
   * 配置参见 https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver
   */
  lazy: {
    type: [Boolean, Object] as PropType<boolean | IntersectionObserverInit>,
  },
};

export type FigurePropsT = ExtractPropTypes<typeof figureProps>;
