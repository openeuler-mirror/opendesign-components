import { ExtractPropTypes, PropType } from 'vue';

type PreviewCloseType = 'none' | 'button' | 'mask' | 'body';

export const figureProps = {
  /**
   * @zh-CN 资源地址
   * @en-US Resource address
   */
  src: {
    type: String,
    required: true as const,
  },
  /**
   * @zh-CN 宽高比
   * @en-US Width/height ratio
   */
  ratio: {
    type: Number,
  },
  /**
   * @zh-CN 图片填充方式 (cover | contain | fill | none | scale-down)
   * @en-US Image fill mode (cover | contain | fill | none | scale-down)
   */
  fit: {
    type: String,
  },
  /**
   * @zh-CN 图片描述，同 img 的 alt 属性
   * @en-US Image description, same as the alt attribute of img element
   */
  alt: {
    type: String,
  },
  /**
   * @zh-CN 使用背景展示图片而非img元素
   * @en-US Use background to display image instead of img element
   */
  background: {
    type: Boolean,
  },
  /**
   * @zh-CN 鼠标悬停时图片放大
   * @en-US Mouse hover to zoom image
   */
  hoverable: {
    type: Boolean,
  },
  /**
   * @zh-CN 点击图片时跳转链接
   * @en-US Click image to jump link
   */
  href: {
    type: String,
  },
  /**
   * @zh-CN 图片加载完成前显示的预制随机多彩背景
   * @en-US Show a colorful background before the image is loaded
   */
  colorful: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否可点击预览
   * @en-US Whether clickable preview
   */
  preview: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否支持调用实例接口进行预览
   * @en-US Whether to support calling instance interface to preview
   */
  lazyPreview: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否将组件渲染为视频海报（具有视频播放按钮，鼠标hover放大图片等效果）
   * @en-US Whether to render the component as a video poster (with video play button, mouse hover to zoom image effect)
   */
  videoPoster: {
    type: Boolean,
  },
  /**
   * @zh-CN 预览关闭方式，'none' 表示使用默认关闭方式，'button'表示点击按钮关闭，'mask'表示点击遮罩关闭，'body'表示点击预览图片关闭
   * @en-US Preview close method. 'none' means use default close method, 'button' means close by clicking button, 'mask' means close by clicking mask, 'body' means close by clicking preview image
   */
  previewClose: {
    type: [String, Array] as PropType<PreviewCloseType | PreviewCloseType[]>,
  },
  /**
   * @zh-CN 图片懒加载配置项，false表示不使用懒加载，true表示启用懒加载，对象表示IntersectionObserverInit配置项。
   * @en-US Image lazy loading configuration item, false means not to use lazy loading, true means to enable lazy loading, object means IntersectionObserverInit configuration item.
   */
  lazy: {
    type: [Boolean, Object] as PropType<boolean | IntersectionObserverInit>,
  },
};

export type FigurePropsT = ExtractPropTypes<typeof figureProps>;
