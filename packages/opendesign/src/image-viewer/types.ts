import { ExtractPropTypes, PropType } from 'vue';
import type { LayerPropsT } from '../layer/types';

/**
 * 图片查看器操作类型
 */
export const ImageViewerActionTypes = ['zoomIn', 'zoomOut', 'rotateLeft', 'rotateRight'] as const;
export type ImageViewerAction = (typeof ImageViewerActionTypes)[number];

/**
 * crossorigin 属性类型
 */
export const ImageViewerCrossoriginTypes = ['anonymous', 'use-credentials', ''] as const;
export type ImageViewerCrossorigin = (typeof ImageViewerCrossoriginTypes)[number];

/**
 * 工具栏可配置项
 * @description 控制工具栏显示哪些工具按钮及其排列顺序。
 * 'mode' 已移除（适屏缩放取代模式切换），传入时静默忽略。
 */
export const ImageViewerToolbarItemTypes = ['zoomIn', 'zoomOut', 'reset', 'rotateLeft', 'rotateRight', 'close'] as const;
export type ImageViewerToolbarItem = (typeof ImageViewerToolbarItemTypes)[number];

/**
 * 内部 OLayer 属性透传配置
 * @description 这些属性直接透传给 OImageViewer 内部持有的 OLayer 组件，
 * 控制遮罩层、关闭按钮、teleport 目标、过渡动画等浮层行为。
 * 排除 `visible`（由 OImageViewer 自身的 v-model:visible 控制），其余属性与 OLayer 一致。
 */
export type ImageViewerLayerOptions = Partial<Omit<LayerPropsT, 'visible'>>;

/**
 * OImageViewer 组件级 OLayer 默认配置
 * @description 作为组件场景与函数式场景的单一来源。组件模板中直接展开此对象，
 * 函数式场景（`useImageViewer`）同样在此基础上合并用户传入的 `layerOptions`。
 */
export const DEFAULT_LAYER_OPTIONS: ImageViewerLayerOptions = {
  mask: true,
  maskClose: false,
  buttonClose: true,
  wrapper: null,
};

export const imageViewerProps = {
  /**
   * @zh-CN 预览资源组
   * @en-US Preview Resource Group.
   */
  previewList: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  /**
   * @zh-CN 预览图片缩放的速率
   * @en-US Preview the rate of image zooming.
   */
  zoomRate: {
    type: Number,
    default: 1.2,
  },
  /**
   * @zh-CN 用户手动缩放的最小比例。当适屏缩放比例（containScale）低于此值时，有效下界自动扩展至 containScale，确保初始展示完整可见且放大时平滑过渡
   * @en-US Minimum zoom ratio for user manual zoom. When the fit-to-screen scale (containScale) falls below this value, the effective lower bound automatically expands to containScale, ensuring a fully visible initial state and smooth zoom-in transition
   */
  minScale: {
    type: Number,
    default: 0.1,
  },
  /**
   * @zh-CN 预览图片最大缩放比例
   * @en-US Maximum zoom ratio for preview images.
   */
  maxScale: {
    type: Number,
    default: 8,
  },
  /**
   * @zh-CN 展示预览图片实际缩放百分比
   * @en-US Show the actual zoom percentage of the preview image.
   */
  showZoomRatio: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 展示预览图片实际缩放百分比的持续时间
   * @en-US Show the duration of the actual zoom percentage of the preview image.
   */
  duration: {
    type: Number,
    default: 500,
  },
  /**
   * @zh-CN 当前预览图片的下标，支持 `v-model`
   * @en-US Current preview image index, supports `v-model`.
   */
  currentIndex: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 是否无限循环切换图片
   * @en-US Whether to switch images infinitely.
   */
  infinite: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 当前缩放比例，支持 `v-model`
   * @description 传入该值时图片加载后保持该缩放比例，不自动适屏；不传时自动计算适屏缩放（小图放大至 200%，大图缩至整屏可见）。
   * @en-US Current scale of the preview image, supports `v-model`.
   * @description When provided, the image keeps this scale after loading without auto-fitting; when omitted, auto-fit is applied (small images zoom to 200%, large images shrink to fit screen).
   */
  scale: {
    type: Number,
  },
  /**
   * @zh-CN 图片的 crossorigin 属性
   * @en-US crossorigin attribute for the image.
   */
  crossorigin: {
    type: String as PropType<ImageViewerCrossorigin>,
    default: '',
  },
  /**
   * @zh-CN 是否显示图片切换进度指示器
   * @en-US Whether to show the image switching progress indicator.
   */
  showProgress: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 工具栏配置：传 `true` 渲染全部按钮；传 `false` 或空数组隐藏整个操作区；传数组则按给定顺序渲染对应按钮
   * @en-US Toolbar configuration: pass `true` to render all buttons; pass `false` or an empty array to hide the entire action area; pass an array to render the corresponding buttons in the given order.
   */
  toolbar: {
    type: [Array, Boolean] as PropType<ImageViewerToolbarItem[] | boolean>,
    default: () => ['zoomOut', 'zoomIn', 'reset', 'close'] as Array<ImageViewerToolbarItem>,
  },
  /**
   * @zh-CN 是否可以通过按 ESC 键关闭预览
   * @en-US Whether the preview can be closed by pressing ESC.
   */
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否启用焦点陷阱（无障碍）
   * @en-US Whether to enable focus trap (accessibility).
   */
  focusTrap: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否允许缩放图片。为 `false` 时，非移动端（具备 hover 且 fine pointer）缩放锁定为适屏比例，工具栏不展示缩放相关按钮（zoomIn / zoomOut / reset）；若过滤后仅剩 `close`，则隐藏整个操作区。移动端仍允许双指缩放（自然手势）
   * @en-US Whether image scaling is allowed. When `false`, scaling is locked to the fit-to-screen ratio on non-mobile devices (hover-capable with fine pointer), and zoom-related toolbar buttons (zoomIn / zoomOut / reset) are hidden; if only `close` remains after filtering, the entire action area is hidden. Pinch-to-zoom remains available on touch devices
   */
  scalable: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 点击图片是否关闭预览（拖拽后不触发）
   * @en-US Whether clicking the image closes the preview (not triggered after drag).
   */
  bodyClose: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 内部 OLayer 属性透传，控制遮罩层、关闭按钮、teleport 目标等浮层行为
   * @en-US Internal OLayer props pass-through, controls mask, close button, teleport target, etc.
   */
  layerOptions: {
    type: Object as PropType<ImageViewerLayerOptions>,
  },
  /**
   * @zh-CN 预览包裹层的自定义类名，追加在 `.o-image-viewer-wrapper` 上。OFigure 传入 `o-figure-preview-wrapper`
   * @en-US Custom class for the preview wrapper, appended to `.o-image-viewer-wrapper`. OFigure passes `o-figure-preview-wrapper`
   */
  wrapperClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    default: '',
  },
  /**
   * @zh-CN 图片容器的自定义类名，追加在 `.o-image-viewer-container` 上。OFigure 传入 `o-figure-preview-img`
   * @en-US Custom class for the image container, appended to `.o-image-viewer-container`. OFigure passes `o-figure-preview-img`
   */
  containerClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    default: '',
  },
};
export type ImageViewerPropsT = ExtractPropTypes<typeof imageViewerProps>;
