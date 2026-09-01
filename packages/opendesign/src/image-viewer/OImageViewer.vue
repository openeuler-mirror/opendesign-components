<script setup lang="ts">
import { type Component, computed, type CSSProperties, nextTick, onMounted, ref, watch } from 'vue';
import { clamp, useEventListener, useMediaQuery, useSwipe, useThrottleFn, useTimeoutFn } from '@vueuse/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconImageError,
  IconOneToOne,
  IconRotateAnticlockwise,
  IconRotateClockwise,
  IconZoomIn,
  IconZoomOut,
} from '../_utils/icons';
import { OLayer } from '../layer';
import { OButton } from '../button';
import { type ImageViewerAction, DEFAULT_LAYER_OPTIONS, imageViewerProps, type ImageViewerToolbarItem, ImageViewerToolbarItemTypes } from './types';
import { useI18n } from '../locale';

const props = defineProps(imageViewerProps);

/**
 * @zh-CN 是否可见，双向绑定属性
 * @en-US Whether the viewer is visible, two-way binding property.
 */
const visible = defineModel<boolean>('visible', { default: true });

/**
 * @zh-CN 当前预览图片下标，双向绑定属性
 * @en-US Current preview image index, two-way binding property.
 */
const currentIndex = defineModel<number>('currentIndex', { default: 0 });

/**
 * @zh-CN 当前缩放比例，双向绑定属性
 * @description 传入该值时图片加载后保持该缩放比例，不自动适屏；不传时自动计算适屏缩放（小图放大至 200%，大图缩至整屏可见）。
 * @en-US Current scale of the preview image, two-way binding property.
 * @description When provided, the image keeps this scale after loading without auto-fitting; when omitted, auto-fit is applied (small images zoom to 200%, large images shrink to fit screen).
 */
const scale = defineModel<number>('scale');

/**
 * 是否为非移动端（具备 hover 且 fine pointer）
 * @description 用于 `scalable` 为 `false` 时判断是否锁定缩放：
 * 非移动端锁定缩放比例，移动端（触摸设备）仍允许双指缩放（自然手势）。
 * SSR 安全：服务端始终为 `false`，客户端挂载后更新为实际值，不影响 hydration。
 */
const isDesktop = useMediaQuery('(hover: hover) and (pointer: fine)');

/**
 * 缩放比例初始快照，用于 resetTransform 重置基准
 * @description 父组件传入 scale 时为该值（数字），未传入时为 undefined。
 * undefined 作为"自动适屏模式"信号：onImgLoaded 应用 fitScale，
 * resetTransform / 切图重置回退到 fitScale，zoomDisabled contain 锁定生效。
 */
const initialScale = scale.value;

const emits = defineEmits<{
  /**
   * @zh-CN 图片拖拽状态变化时触发，值为 true 表示发生了拖拽，值为 false 表示仅为点击
   * @en-US Triggered when image drag state changes, true means dragged, false means click only
   */
  (e: 'zoom-drag', value: boolean): void;
  /**
   * @zh-CN 关闭预览时触发
   * @en-US Triggered when the preview is closed
   */
  (e: 'close'): void;
  /**
   * @zh-CN 预览图片切换时触发，返回切换后的索引
   * @en-US Triggered when the preview image switches, returns the new index
   */
  (e: 'switch', index: number): void;
  /**
   * @zh-CN 图片加载失败时触发
   * @en-US Triggered when the image fails to load
   */
  (e: 'error', evt: Event): void;
  /**
   * @zh-CN 图片旋转时触发，返回当前旋转角度
   * @en-US Triggered when the image is rotated, returns the current rotation degree
   */
  (e: 'rotate', deg: number): void;
}>();

defineSlots<{
  /**
   * @zh-CN 自定义预览内容，替换默认的图片查看器 UI（如视频播放器）
   * @en-US Custom preview content, replaces the default image viewer UI (e.g. video player)
   */
  preview?(props: { src: string }): any;
  /**
   * @zh-CN 默认插槽，渲染在预览包裹层内、图片容器外，可用于叠加自定义覆盖内容
   * @en-US Default slot, rendered inside the preview wrapper but outside the image container, useful for overlaying custom content
   */
  default?(): any;
  /**
   * @zh-CN 自定义工具栏，接收操作方法和当前索引等上下文
   * @en-US Custom toolbar, receives action methods and current index context
   */
  toolbar?(props: {
    actions: (
      action: ImageViewerAction,
      options?: {
        zoomRate?: number;
        rotateDeg?: number;
        enableTransition?: boolean;
      },
    ) => void;
    prev: () => void;
    next: () => void;
    reset: () => void;
    activeIndex: number;
    setActiveItem: (index: number) => void;
  }): any;
  /**
   * @zh-CN 自定义进度指示器，接收当前索引和图片总数
   * @en-US Custom progress indicator, receives current index and total count
   */
  progress?(props: { activeIndex: number; total: number }): any;
  /**
   * @zh-CN 自定义图片加载错误提示，接收当前索引和图片地址
   * @en-US Custom image load error display, receives current index and image URL
   */
  error?(props: { activeIndex: number; src: string }): any;
}>();

const { t } = useI18n();

/** 触摸缩放起点的缩放比例（只在 onTouchStart 时设置，move 期间不变） */
let pinchStartScale = 1;
/** 双指缩放初始距离（只在 onTouchStart 时设置，move 期间不变） */
let pinchStartDistance = 0;
/** 单指拖拽起点 X 坐标 */
let dragStartX = 0;
/** 单指拖拽起点 Y 坐标 */
let dragStartY = 0;

/** 是否正在拖拽 */
const isDragging = ref(false);
/** 当前图片是否正在加载 */
const isLoading = ref(true);
/** 图片是否加载失败 */
const loadError = ref(false);
/** 触摸过程中是否发生了拖拽/缩放位移（用于区分 swipe 手势和拖拽） */
const touchMoved = ref(false);
/** 索引越界纠正（previewList 为空或 currentIndex 超出范围时回退到 0） */
if (currentIndex.value < 0 || currentIndex.value >= props.previewList.length) {
  currentIndex.value = 0;
}
/** 图片包裹元素 DOM 引用（承载 transform 缩放/旋转/拖拽） */
const imageWrapperRef = ref<HTMLElement | null>(null);
/**
 * OLayer 组件实例引用（即组件根元素）
 * @description OLayer 是 OImageViewer 的根元素，
 * `rootEl` getter 暴露 `.o-layer` DOM 节点，用于 swipe 手势、滚轮缩放、
 * 键盘导航、焦点陷阱与 `focus()` 等所有根级事件绑定。
 */
const rootRef = ref<InstanceType<typeof OLayer> | null>(null);
/**
 * OLayer 根 DOM 元素
 * @description 从 OLayer 组件实例的 rootEl getter 获取，
 * 用于 useSwipe、useEventListener 等需要 DOM 目标的场景。
 */
const rootElRef = computed<HTMLElement | null>(() => rootRef.value?.rootEl ?? null);
/**
 * OLayer 内容区 DOM 元素（`.o-layer-main`，携带 `o-image-viewer-body` 类）
 * @description 用于 body close 点击监听（等效于 @click.self）。
 */
const mainElRef = computed<HTMLElement | null>(() => rootRef.value?.mainEl ?? null);
/** 图片元素引用 */
const imgRef = ref<HTMLImageElement | null>(null);
/** 图片元素 key，retry 时递增以强制重建 img 元素 */
const imgKey = ref(0);

/**
 * 图片切换方向
 * @description 'next' / 'prev' 用于上下张导航的左右滑动动画；
 * 'fade' 用于非导航场景（如 retry 重试），使用淡入淡出而非方向性滑动。
 * prev() / next() 在调用 setActiveItem 前设置方向；retry() 设置为 'fade'。
 */
const slideDirection = ref<'next' | 'prev' | 'fade'>('next');

/**
 * 图片切换过渡动画名称
 * @description 根据 slideDirection 计算对应的 Vue Transition 组件 name，
 * 导航切换使用方向性滑动动画，retry 等非导航场景使用淡入淡出。
 */
const imageTransitionName = computed(() => {
  if (slideDirection.value === 'fade') return 'o-fade-in';
  return slideDirection.value === 'prev' ? 'o-image-slide-prev' : 'o-image-slide-next';
});

/**
 * 容器滑动方向 CSS 类
 * @description 挂载在 .o-image-viewer-container 上，标识当前切换方向，
 * 供 CSS 定制与测试断言使用。
 */
const slideClass = computed(() => `o-image-viewer-slide-${slideDirection.value}`);

/** close 事件防重触发标记 */
const closeGuard = ref(false);
/** 刚结束的拖拽是否产生了位移，用于区分 click 和 drag */
const justDragged = ref(false);

/**
 * 适屏缩放比例（默认展示比例）
 * @description 图片加载后根据自然尺寸与容器尺寸计算（见 updateFitScale）：
 * 目标为 200%（2 倍原始尺寸），但不超过屏幕可视区域（两边都不超出）。
 * 即 min(2, scaleW, scaleH)，对于大图自动降为适屏 contain 比例。
 * resetTransform 重置、图片切换重置、图片加载初始化均使用此值。
 */
const fitScale = ref(initialScale);

/**
 * contain 缩放比例（整图可见，不超原始尺寸）
 * @description min(1, scaleW, scaleH)，用于 scalable=false 时锁定为 contain 模式，
 * 以及 effectiveMinScale 的动态下界计算。
 */
const containScale = ref(initialScale);

/**
 * 有效最小缩放比例
 * @description 动态扩展用户设定的 minScale：若 containScale 低于 minScale，
 * 以 containScale 为有效下界，确保从适屏位置手动放大时平滑过渡，不跳跃。
 * 图片加载前 containScale 为 undefined，此时回退到 minScale 避免 NaN。
 */
const effectiveMinScale = computed(() => (containScale.value == null ? props.minScale : Math.min(props.minScale, containScale.value)));

/**
 * 有效最大缩放比例
 * @description 动态扩展用户设定的 maxScale：若 fitScale 高于 maxScale（极端小图场景），
 * 以 fitScale 为有效上界，确保初始 200% 展示后用户仍可缩放至该比例。
 * 图片加载前 fitScale 为 undefined，此时回退到 maxScale 避免 NaN。
 */
const effectiveMaxScale = computed(() => (fitScale.value == null ? props.maxScale : Math.max(props.maxScale, fitScale.value)));

/**
 * 是否禁用缩放交互
 * @description `scalable` 为 `false` 且在非移动端（具备 hover 且 fine pointer）时，
 * 禁止滚轮、键盘、双指等缩放操作，缩放锁定为适屏比例。
 * 移动端（触摸设备）不受影响——双指缩放是自然手势。
 */
const zoomDisabled = computed(() => !props.scalable && isDesktop.value);

/** 缩放与位移状态 */
const transform = ref({
  // 父组件传入 scale 时用该值，未传入时回退到 1 作为加载前安全默认值
  scale: scale.value ?? 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false,
});
/** 拖拽开始前的 transform 快照，用于判断是否发生了拖拽 */
const lastTransform = ref({ ...transform.value });
/** 缩放比例提示是否隐藏 */
const hideZoomRatio = ref(true);

/**
 * scale model ↔ transform 双向同步锁
 * @description 防止内部同步写入 scale/transform 后触发 watcher 链回环覆盖 fitScale。
 * onImgLoaded、resetTransform、图片切换重置及 watcher 中均需先置为 true 再同步赋值，
 * 随后在 nextTick 中释放锁以跳过同一 flush 周期内的关联 watcher。
 */
let isSyncingScale = false;

/** 当前预览图片地址 */
const currentUrl = computed(() => props.previewList[currentIndex.value] ?? '');

/** 是否支持多图切换 */
const canNavigate = computed(() => props.previewList.length > 1);
/** 是否存在上一张（考虑无限循环） */
const hasPrev = computed(() => props.infinite || currentIndex.value > 0);
/** 是否存在下一张（考虑无限循环） */
const hasNext = computed(() => props.infinite || currentIndex.value < props.previewList.length - 1);

/** 容器 transform 样式 */
const containerStyle = computed<CSSProperties>(() => {
  const { scale: imgScale, deg, offsetX, offsetY, enableTransition } = transform.value;
  let translateX = offsetX / imgScale;
  let translateY = offsetY / imgScale;

  // 旋转后修正位移，使拖拽方向与视觉一致
  const radian = (deg * Math.PI) / 180;
  const cosR = Math.cos(radian);
  const sinR = Math.sin(radian);
  const origTranslateX = translateX;
  translateX = translateX * cosR + translateY * sinR;
  translateY = translateY * cosR - origTranslateX * sinR;

  const style: CSSProperties = {
    transform: `scale(${imgScale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? 'transform .3s ease' : '',
  };
  return style;
});

/** 缩放百分比文本 */
const zoomRatio = computed(() => `${Math.round(transform.value.scale * 100)}%`);

/**
 * 工具栏按钮列表
 * @description toolbar 为 true 时渲染全部按钮（按 ImageViewerToolbarItemTypes 顺序）；
 * 为数组时按给定顺序过滤掉不在合法类型集合中的项（如已移除的 'mode'），静默忽略；
 * 为 false 或空数组时返回空数组（操作区整体隐藏，由 showActionAreaComputed 控制）。
 * `scalable` 为 `false` 时额外过滤缩放相关项（zoomIn / zoomOut / reset）。
 */
const SCALE_TOOLBAR_ITEMS = new Set<ImageViewerToolbarItem>(['zoomIn', 'zoomOut', 'reset']);
const validToolbarItems = new Set<string>(ImageViewerToolbarItemTypes);
const toolbarItems = computed<ImageViewerToolbarItem[]>(() => {
  const baseItems =
    props.toolbar === true ? [...ImageViewerToolbarItemTypes] : Array.isArray(props.toolbar) ? props.toolbar.filter((item) => validToolbarItems.has(item)) : [];
  // scalable 为 false 时过滤缩放相关工具栏项
  if (!props.scalable) {
    return baseItems.filter((item) => !SCALE_TOOLBAR_ITEMS.has(item));
  }
  return baseItems;
});

/**
 * 是否显示操作区
 * @description 仅由 toolbar prop 控制（false / 空数组隐藏，true / 非空数组显示）。
 * `scalable` 为 `false` 时，过滤后仅剩 `close` 也会隐藏（close 可由 OLayer 关闭按钮替代）。
 * 触摸设备的响应式隐藏由 CSS @media (hover:none) and (pointer:coarse) 控制，用户可覆盖。
 */
const showActionAreaComputed = computed(() => {
  if (props.toolbar === false) return false;
  const items = toolbarItems.value;
  if (items.length === 0) return false;
  // scalable 为 false 时，过滤后仅剩 close 则隐藏操作区
  if (!props.scalable && items.length === 1 && items[0] === 'close') return false;
  return true;
});

/** 是否显示缩放比例提示 */
const showZoomRatio = computed(() => !hideZoomRatio.value && props.showZoomRatio);

/** 进度文本 */
const progress = computed(() => `${currentIndex.value + 1} / ${props.previewList.length}`);

/** 拖拽过程中 transform 是否发生了变化 */
const hasTransformChanged = computed(() => {
  const { scale: imgScale, offsetX, offsetY } = transform.value;
  const last = lastTransform.value;
  return imgScale !== last.scale || offsetX !== last.offsetX || offsetY !== last.offsetY;
});

/**
 * 工具栏图标映射（使用 computed 保持全局图标替换的响应性）
 */
const toolbarIconMap = computed<Record<ImageViewerToolbarItem, Component>>(() => ({
  zoomIn: IconZoomIn.value,
  zoomOut: IconZoomOut.value,
  reset: IconOneToOne.value,
  rotateLeft: IconRotateAnticlockwise.value,
  rotateRight: IconRotateClockwise.value,
  close: IconClose.value,
}));

/**
 * 工具栏 aria-label 映射（使用 computed 保持语言切换的响应性）
 */
const toolbarLabelMap = computed<Record<ImageViewerToolbarItem, string>>(() => ({
  zoomIn: t('imageViewer.zoomIn'),
  zoomOut: t('imageViewer.zoomOut'),
  reset: t('imageViewer.reset'),
  rotateLeft: t('imageViewer.rotateLeft'),
  rotateRight: t('imageViewer.rotateRight'),
  close: t('imageViewer.close'),
}));

/**
 * 切换到指定索引的图片
 * @description 切换前由 prev()/next() 设置 slideDirection，
 * 外部直接调用 setActiveItem 时根据索引差值推断方向。
 * @param i 目标索引
 */
const setActiveItem = (i: number) => {
  const len = props.previewList.length;
  if (len === 0) return;
  // 无限循环时取模，否则边界裁剪
  const target = props.infinite ? (i + len) % len : clamp(i, 0, len - 1);
  if (target === currentIndex.value) return;
  currentIndex.value = target;
  emits('switch', target);
};

/** 切换到上一张 */
const prev = () => {
  if (!props.infinite && currentIndex.value === 0) return;
  slideDirection.value = 'prev';
  setActiveItem(currentIndex.value - 1);
};

/** 切换到下一张 */
const next = () => {
  if (!props.infinite && currentIndex.value === props.previewList.length - 1) return;
  slideDirection.value = 'next';
  setActiveItem(currentIndex.value + 1);
};

/**
 * 关闭预览
 * @description 设置 visible model 为 false（自动发射 update:visible），并发射 close 事件。
 * closeGuard 防止 OLayer 的 @change 回调与 onClose 同时触发导致 close 事件重复。
 */
const onClose = () => {
  if (closeGuard.value) return;
  closeGuard.value = true;
  visible.value = false;
  emits('close');
};

/**
 * OLayer 可见性变化回调
 * @description 当 OLayer 自身关闭（如遮罩点击、OLayer 关闭按钮）时触发，
 * 此时 v-model:visible 已将 visible model 同步为 false，只需补充发射 close 事件。
 * closeGuard 防止 onClose 与 onLayerChange 同时触发导致 close 事件重复。
 * @param val OLayer 当前可见状态
 */
const onLayerChange = (val: boolean) => {
  if (!val && !closeGuard.value) {
    closeGuard.value = true;
    emits('close');
  }
};

/**
 * 计算适屏缩放比例
 * @description 根据图片自然尺寸与容器可用尺寸计算：
 * - fitScale = min(2, scaleW, scaleH)：目标 200%，但两边都不超出屏幕
 * - containScale = min(1, scaleW, scaleH)：整图可见且不超原始尺寸（contain 模式），
 *   用于 scalable=false 场景
 * 计算结果存入 fitScale / containScale，供 onImgLoaded 设置初始 scale 及 resetTransform 重置。
 */
const updateFitScale = () => {
  const img = imgRef.value;
  if (!img) return;

  const { naturalWidth, naturalHeight } = img;
  if (!naturalWidth || !naturalHeight) return;

  // 使用 OLayer 根元素（.o-layer, position:fixed; inset:0）尺寸作为可用空间，
  // 而非 body（.o-image-viewer-body）——body 的 clientWidth 会被内部大图撑开导致计算错误。
  // 根元素不可用时回退到视口尺寸（兼容测试环境等无布局场景）。
  const root = rootElRef.value;
  const viewWidth = root?.clientWidth || window.innerWidth;
  const viewHeight = root?.clientHeight || window.innerHeight;
  if (!viewWidth || !viewHeight) return;

  const scaleW = viewWidth / naturalWidth;
  const scaleH = viewHeight / naturalHeight;
  fitScale.value = Math.min(2, scaleW, scaleH);
  containScale.value = Math.min(1, scaleW, scaleH);
};

/** 缩放比例提示定时器（自动随组件卸载清理，interval 通过 getter 响应 prop 变化） */
const timeoutRef = useTimeoutFn(
  () => {
    hideZoomRatio.value = true;
  },
  () => props.duration,
);

/** 短暂展示缩放比例提示，持续时长由 useTimeoutFn 的 interval（props.duration）决定 */
const toggleZoomRatioBubble = () => {
  if (!props.showZoomRatio) return;
  hideZoomRatio.value = false;
  timeoutRef.start();
};

/** 图片加载完成 */
const onImgLoaded = () => {
  isLoading.value = false;
  loadError.value = false;
  // 图片加载完成后计算适屏缩放并应用为初始 scale
  updateFitScale();
  // 父组件显式传入 scale 时，尊重其缩放设置，跳过自动适屏
  if (initialScale !== undefined) {
    transform.value.enableTransition = true;
    return;
  }
  // scalable=false 且非移动端时锁定为 contain 模式（整图可见，不超原始尺寸）；
  // 否则使用 fitScale（目标 200%，两边不超屏幕）
  const targetScale = zoomDisabled.value ? containScale.value : fitScale.value;
  // 同步设置 transform 和 scale model，用 sync lock 阻止 watcher 链干扰
  isSyncingScale = true;
  transform.value.scale = targetScale;
  scale.value = targetScale;
  transform.value.enableTransition = true;
  nextTick(() => {
    isSyncingScale = false;
  });
  // 图片加载后初始展示时显示缩放比例指示器，0.5s 后自动消失
  toggleZoomRatioBubble();
};

/** 图片加载失败 */
const onImgError = (e: Event) => {
  // 空地址（previewList 为空或越界）时浏览器解析 src="" 为页面 URL 并触发 error，
  // 此场景非真实加载失败，跳过错误状态以避免触发 Transition 离场动画
  if (!currentUrl.value) return;
  isLoading.value = false;
  loadError.value = true;
  emits('error', e);
};

/** 重试加载图片 */
const retry = () => {
  // 非导航场景使用淡入淡出动画
  slideDirection.value = 'fade';
  loadError.value = false;
  isLoading.value = true;
  // 递增 key 强制重建 img 元素，绕过浏览器缓存触发重新请求
  imgKey.value++;
};

/**
 * 鼠标按下开始拖拽
 * @description 使用 VueUse useEventListener 在 document 级监听 mousemove/mouseup，
 * 组件卸载时自动清理。isLoading / loadError 检查确保图片就绪后才允许交互。
 * @param e 鼠标事件
 */
const onMouseDown = (e: MouseEvent) => {
  if (isLoading.value || loadError.value || e.button !== 0) return;
  transform.value.enableTransition = false;

  const { offsetX, offsetY } = transform.value;
  const startX = e.pageX;
  const startY = e.pageY;

  lastTransform.value = { ...transform.value };
  isDragging.value = true;

  // 节流拖拽处理
  const throttledMove = useThrottleFn((ev: MouseEvent) => {
    transform.value = {
      ...transform.value,
      offsetX: offsetX + ev.pageX - startX,
      offsetY: offsetY + ev.pageY - startY,
    };
  }, 16);

  // 使用 VueUse useEventListener 自动清理（effectScope 内）
  const removeMousemove = useEventListener(document, 'mousemove', throttledMove);
  const removeMouseup = useEventListener(document, 'mouseup', () => {
    isDragging.value = false;
    removeMousemove();
    removeMouseup();
    // 标记刚结束的拖拽是否产生了位移，供 bodyClose 的 click 判断
    justDragged.value = hasTransformChanged.value;
    emits('zoom-drag', hasTransformChanged.value);
  });

  e.preventDefault();
};

/**
 * 处理缩放/旋转操作
 * @description 仅在缩放比例实际发生变化时显示比例指示器；
 * 旋转操作和已达边界的缩放操作不触发指示器。
 * @param action 操作类型
 * @param options 可选参数
 */
const handleActions = (action: ImageViewerAction, options: { zoomRate?: number; rotateDeg?: number; enableTransition?: boolean } = {}) => {
  if (isLoading.value || loadError.value) return;
  // scalable 为 false 且非移动端时，禁用缩放操作
  if (zoomDisabled.value && (action === 'zoomIn' || action === 'zoomOut')) return;
  // 使用动态有效边界：containScale 低于 minScale 时自动扩展下界，确保平滑缩放
  const minScale = effectiveMinScale.value;
  const maxScale = effectiveMaxScale.value;
  const { zoomRate = props.zoomRate, rotateDeg = 90, enableTransition = true } = options;

  const prevScale = transform.value.scale;

  const actionHandlers: Record<string, () => void> = {
    zoomOut: () => {
      if (transform.value.scale > minScale) {
        // 缩小后将结果 clamp 到 minScale，防止越界
        transform.value.scale = Math.max(Number.parseFloat((transform.value.scale / zoomRate).toFixed(3)), minScale);
      }
    },
    zoomIn: () => {
      if (transform.value.scale < maxScale) {
        // 放大后将结果 clamp 到 maxScale，防止越界
        transform.value.scale = Math.min(Number.parseFloat((transform.value.scale * zoomRate).toFixed(3)), maxScale);
      }
    },
    rotateRight: () => {
      transform.value.deg += rotateDeg;
      emits('rotate', transform.value.deg);
    },
    rotateLeft: () => {
      transform.value.deg -= rotateDeg;
      emits('rotate', transform.value.deg);
    },
  };

  actionHandlers[action]?.();
  transform.value.enableTransition = enableTransition;
  // 仅在缩放比例实际变化时显示比例指示器
  if (transform.value.scale !== prevScale) {
    toggleZoomRatioBubble();
  }
};

/** 节流后的滚轮缩放计算 */
const throttledZoom = useThrottleFn((e: WheelEvent) => {
  const delta = e.deltaY || e.deltaX;
  handleActions(delta < 0 ? 'zoomIn' : 'zoomOut', { enableTransition: false });
}, 16);

/**
 * 滚轮缩放，同步阻止默认滚动行为 + 节流缩放
 * @param e 滚轮事件
 */
const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  // scalable 为 false 且非移动端时，阻止滚轮缩放（仍 preventDefault 防止页面滚动）
  if (zoomDisabled.value) return;
  throttledZoom(e);
};

/**
 * 重置缩放、位移与旋转
 * @description 父组件传入 scale 时重置到 initialScale（父组件指定的基准），
 * 否则重置到适屏缩放比例（fitScale）。
 * 仅在缩放比例实际变化时显示比例指示器。
 */
const resetTransform = () => {
  const prevScale = transform.value.scale;
  // 父组件传入 scale 时重置到该值，否则重置到适屏比例
  const targetScale = initialScale ?? fitScale.value;
  // 同步设置 transform 和 scale model，用 sync lock 阻止 watcher 链干扰
  isSyncingScale = true;
  transform.value = {
    scale: targetScale,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: true,
  };
  scale.value = targetScale;
  nextTick(() => {
    isSyncingScale = false;
  });
  if (transform.value.scale !== prevScale) {
    toggleZoomRatioBubble();
  }
};

/**
 * 工具栏按钮点击
 */
const onToolbarItem = (item: ImageViewerToolbarItem) => {
  const toolbarActions: Record<string, () => void> = {
    zoomIn: () => handleActions('zoomIn'),
    zoomOut: () => handleActions('zoomOut'),
    reset: resetTransform,
    rotateLeft: () => handleActions('rotateLeft'),
    rotateRight: () => handleActions('rotateRight'),
    close: onClose,
  };

  toolbarActions[item]?.();
};

/**
 * 键盘导航：左右切换图片，上下缩放，Esc 关闭
 * @param e 键盘事件
 */
const onKeydown = (e: KeyboardEvent) => {
  const keyActions: Record<string, () => void> = {
    ArrowLeft: prev,
    ArrowRight: next,
    ArrowUp: () => handleActions('zoomIn'),
    ArrowDown: () => handleActions('zoomOut'),
    Escape: () => {
      if (props.closeOnPressEscape) {
        onClose();
      }
    },
  };

  keyActions[e.key]?.();
};

/** 计算双指距离 */
const getTouchDistance = (touches: TouchList) => {
  const dx = Math.abs(touches[0].clientX - touches[1].clientX);
  const dy = Math.abs(touches[0].clientY - touches[1].clientY);
  return Math.sqrt(dx * dx + dy * dy);
};

/** 计算双指中心点坐标 */
const getTouchCenter = (touches: TouchList) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2,
});

/**
 * 触摸开始：单指进入拖拽，双指进入缩放
 * @description isLoading / loadError 检查确保图片就绪后才允许交互。
 * 图片未放大且未偏移时（scale <= 1 且 offset 为 0），不进入拖拽模式，
 * 让 useSwipe 处理滑动手势（导航/关闭），避免拖拽与滑动冲突。
 * @param e 触摸事件
 */
const onTouchStart = (e: TouchEvent) => {
  if (isLoading.value || loadError.value) return;
  touchMoved.value = false;
  const touches = e.touches;
  // 图片未放大且未偏移时，触摸用于滑动而非拖拽
  const canDrag = transform.value.scale > 1 || transform.value.offsetX !== 0 || transform.value.offsetY !== 0;

  if (touches.length === 1) {
    if (canDrag) {
      isDragging.value = true;
      transform.value.enableTransition = false;
      dragStartX = touches[0].clientX - transform.value.offsetX;
      dragStartY = touches[0].clientY - transform.value.offsetY;
    }
  } else if (touches.length === 2) {
    isDragging.value = false;
    // scalable 为 false 且非移动端时，不启动双指缩放
    if (zoomDisabled.value) return;
    // 只在 start 时设置基准值，move 期间不变
    pinchStartScale = transform.value.scale;
    pinchStartDistance = getTouchDistance(touches);
  }
};

/** 节流后的触摸移动处理器 */
const onTouchMoveThrottled = useThrottleFn((e: TouchEvent) => {
  const touches = e.touches;
  if (isDragging.value && touches.length === 1) {
    transform.value.offsetX = touches[0].clientX - dragStartX;
    transform.value.offsetY = touches[0].clientY - dragStartY;
    touchMoved.value = true;
  } else if (touches.length === 2 && pinchStartDistance) {
    const minScale = effectiveMinScale.value;
    const maxScale = effectiveMaxScale.value;
    const distance = getTouchDistance(touches);
    // 使用绝对计算：从 start 时的基准值推导当前缩放比
    const tempScale = Number.parseFloat((pinchStartScale * (distance / pinchStartDistance)).toFixed(3));
    const newScale = clamp(tempScale, minScale, maxScale);

    // 以双指中心为缩放原点，保持中心不变
    const touchCenter = getTouchCenter(touches);
    const imageRect = imageWrapperRef.value?.getBoundingClientRect();
    if (imageRect) {
      // 双指中心相对于图片视觉中心的坐标
      const cx = touchCenter.x - imageRect.left - imageRect.width / 2;
      const cy = touchCenter.y - imageRect.top - imageRect.height / 2;
      // 当前缩放比相对于上一帧的变化比例
      const ratio = newScale / transform.value.scale;
      // 修正公式：newOffset = oldOffset + center * (1 - ratio)
      transform.value.offsetX = transform.value.offsetX + cx * (1 - ratio);
      transform.value.offsetY = transform.value.offsetY + cy * (1 - ratio);
    }
    transform.value.scale = newScale;
    touchMoved.value = true;
  }
}, 16);

/**
 * 触摸移动（节流）
 * @param e 触摸事件
 */
const onTouchMove = (e: TouchEvent) => {
  const touches = e.touches;
  const shouldPrevent = (isDragging.value && touches.length === 1) || (touches.length === 2 && pinchStartDistance);
  if (shouldPrevent) {
    e.preventDefault();
  }
  onTouchMoveThrottled(e);
};

/**
 * 触摸结束：全部手指离开时重置状态，双指变单指时切换为拖拽
 * @param e 触摸事件
 */
const onTouchEnd = (e: TouchEvent) => {
  const touches = e.touches;
  if (touches.length === 0) {
    isDragging.value = false;
    pinchStartDistance = 0;
  } else if (touches.length === 1) {
    // 双指变单指，切换为拖拽模式
    isDragging.value = true;
    pinchStartDistance = 0;
    dragStartX = touches[0].clientX - transform.value.offsetX;
    dragStartY = touches[0].clientY - transform.value.offsetY;
  }
};

// ---- 触屏手势：滑动关闭 / 切换图片 ----
const {
  direction: swipeDirection,
  lengthX: swipeLengthX,
  lengthY: swipeLengthY,
} = useSwipe(rootElRef, {
  threshold: 50,
  onSwipeEnd: () => {
    // 图片发生了拖拽或缩放位移时，不触发滑动手势
    if (touchMoved.value) return;
    if (swipeDirection.value === 'down' && swipeLengthY.value > 50) {
      onClose();
    } else if (swipeLengthX.value > 50 && canNavigate.value) {
      // 水平滑动且可切换时，根据方向切换图片
      if (swipeDirection.value === 'left') {
        next();
      } else if (swipeDirection.value === 'right') {
        prev();
      }
    }
  },
});

// ---- 焦点陷阱（无障碍） ----
/**
 * 获取所有可聚焦的元素
 * @description 在 OLayer 根元素内查询，确保包含 OLayer 关闭按钮等 `.o-image-viewer` 外部的可聚焦元素。
 */
const getFocusableElements = (): HTMLElement[] => {
  const root = rootElRef.value;
  if (!root) return [];
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.hasAttribute('disabled'));
};

/**
 * Tab 键焦点循环
 */
const onFocusTrap = (e: KeyboardEvent) => {
  if (!props.focusTrap || e.key !== 'Tab') return;
  const focusable = getFocusableElements();
  if (focusable.length === 0) {
    e.preventDefault();
    rootElRef.value?.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

/**
 * 点击图片容器时的 bodyClose 处理
 * @description 拖拽后的首次点击被拦截（justDragged），不触发关闭。
 * 仅检查 bodyClose——点击图片本身是否关闭，不影响"点击遮罩关闭"行为。
 */
const onContainerClick = () => {
  if (justDragged.value) {
    justDragged.value = false;
    return;
  }
  if (props.bodyClose) {
    onClose();
  }
};

/**
 * 点击预览区域背景（图片以外空白区域）时关闭
 * @description 等效于 @click.self——仅点击 .o-layer-main 自身背景时触发。
 * OLayer 遮罩元素 z-index 为 -1，位于全屏 .o-image-viewer-body 之后，永远收不到 click 事件，
 * 因此"点击遮罩关闭"（layerOptions.maskClose）在 OImageViewer 全屏布局下通过此处实现。
 * 拖拽后的首次点击被拦截（justDragged），不触发关闭。
 */
const onBackgroundClick = () => {
  if (justDragged.value) {
    justDragged.value = false;
    return;
  }
  if (props.bodyClose || props.layerOptions?.maskClose) {
    onClose();
  }
};

// ---- 图片切换时重置状态 ----
// 切换上下张后立即重置缩放、位移、旋转到适屏状态（fitScale），
// 父组件传入 scale 时重置到该值；禁用过渡避免与图片滑动动画叠加；
// 新图加载后 onImgLoaded 会重新计算 fitScale 并应用（未传 scale 时）
watch(currentIndex, (val) => {
  const len = props.previewList.length;
  if (len > 0 && (val < 0 || val >= len)) {
    currentIndex.value = 0;
    return;
  }
  loadError.value = false;
  isLoading.value = true;
  // 父组件传入 scale 时重置到该值，否则重置到适屏比例
  const targetScale = initialScale ?? fitScale.value;
  // 切换图片时立即重置 transform（禁用过渡），避免容器缩放/旋转动画与图片滑动动画叠加
  // 同步设置 transform 和 scale model，用 sync lock 阻止 watcher 链干扰
  isSyncingScale = true;
  transform.value = {
    scale: targetScale,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false,
  };
  scale.value = targetScale;
  nextTick(() => {
    isSyncingScale = false;
  });
});

/** visible model 变为 true 时重置 closeGuard */
watch(visible, (val) => {
  if (val) closeGuard.value = false;
});

/** previewList 缩容时 clamp currentIndex 到有效范围，防止越界 */
watch(
  () => props.previewList.length,
  (len) => {
    const max = len - 1;
    if (currentIndex.value > max) {
      currentIndex.value = Math.max(0, max);
    }
  },
);

/** scale model → transform 同步（外部控制缩放），同时响应 maxScale 变化 */
watch(
  () => clamp(scale.value, effectiveMinScale.value, effectiveMaxScale.value),
  (val) => {
    if (isSyncingScale) return;
    isSyncingScale = true;
    transform.value.scale = val;
    // 延迟重置锁，确保同一 flush 周期内的关联 watcher 被跳过
    nextTick(() => {
      isSyncingScale = false;
    });
  },
);

/** transform → scale model 同步（用户交互缩放回传） */
watch(
  () => transform.value.scale,
  (val) => {
    if (isSyncingScale) return;
    isSyncingScale = true;
    scale.value = val;
    nextTick(() => {
      isSyncingScale = false;
    });
  },
);

/** 图片地址变化时重置加载与错误状态 */
watch(currentUrl, () => {
  loadError.value = false;
  isLoading.value = true;
});

/**
 * 缩放禁用时重置缩放与位移
 * @description `zoomDisabled` 变为 `true` 时（`scalable` 切换为 `false` 或非移动端环境检测生效），
 * 重置缩放比例到 contain 模式（整图可见，不超原始尺寸）并清零位移，
 * 确保图片不停留在已缩放/偏移状态。旋转角度保留不变——旋转是独立于缩放的操作。
 * 父组件显式传入 scale 时跳过 contain 锁定，尊重父组件的缩放设置。
 */
watch(zoomDisabled, (disabled) => {
  if (!disabled) return;
  // 父组件传入 scale 时，不强制 contain 模式
  if (initialScale !== undefined) return;
  isSyncingScale = true;
  transform.value = {
    ...transform.value,
    scale: containScale.value,
    offsetX: 0,
    offsetY: 0,
    enableTransition: true,
  };
  scale.value = containScale.value;
  nextTick(() => {
    isSyncingScale = false;
  });
});

// ---- 事件监听（使用 VueUse，绑定到对应元素，自动清理） ----
// 图片包裹元素事件：拖拽 + 触摸（使用 useEventListener 确保 passive 选项正确）
useEventListener(imageWrapperRef, 'mousedown', onMouseDown);
useEventListener(imageWrapperRef, 'touchstart', onTouchStart, { passive: true });
useEventListener(imageWrapperRef, 'touchmove', onTouchMove, { passive: false });
useEventListener(imageWrapperRef, 'touchend', onTouchEnd, { passive: true });

// 内容区事件：背景点击关闭（等效于 @click.self — 仅点击 .o-layer-main 自身背景时触发）
// maskClose 也在此处生效：OLayer 遮罩 z-index:-1 位于全屏 body 之后，收不到 click，
// 故"点击遮罩关闭"通过 body 背景点击实现
useEventListener(mainElRef, 'click', (e: MouseEvent) => {
  if (e.target !== e.currentTarget) return;
  onBackgroundClick();
});

// 根元素事件：滚轮缩放（阻止默认滚动 + 拦截 ctrl+wheel 浏览器缩放）
useEventListener(
  rootElRef,
  'wheel',
  (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      return;
    }
    onWheel(e);
  },
  { passive: false },
);

// 根元素事件：键盘导航 + 焦点陷阱
// 绑定到根 DOM 元素（.o-layer），覆盖整个浮层含 OLayer 关闭按钮
useEventListener(rootElRef, 'keydown', onKeydown);
useEventListener(rootElRef, 'keydown', onFocusTrap);

// 窗口尺寸变化时重新计算适屏缩放（仅在未传 scale 且未交互缩放时跟随更新）
useEventListener(window, 'resize', () => {
  if (isLoading.value || loadError.value) return;
  const prevScale = transform.value.scale;
  const oldFitScale = fitScale.value;
  const oldContainScale = containScale.value;
  updateFitScale();
  // 仅在自动适屏模式（未传 scale）且用户未手动缩放时跟随适屏更新
  if (initialScale === undefined && (prevScale === oldFitScale || prevScale === oldContainScale)) {
    const targetScale = zoomDisabled.value ? containScale.value : fitScale.value;
    isSyncingScale = true;
    transform.value.scale = targetScale;
    scale.value = targetScale;
    nextTick(() => {
      isSyncingScale = false;
    });
  }
});

onMounted(() => {
  // 组件可见时将焦点设到根元素（tabindex=-1 通过 $attrs 作用于 .o-layer）
  if (props.focusTrap && visible.value) {
    nextTick(() => rootElRef.value?.focus());
  }
});

defineExpose({
  /**
   * @zh-CN 手动切换到指定图片
   * @en-US Manually switch to the image at the specified index
   * @param index 目标索引
   */
  setActiveItem,
  /**
   * @zh-CN 切换到上一张图片
   * @en-US Switch to the previous image
   */
  prev,
  /**
   * @zh-CN 切换到下一张图片
   * @en-US Switch to the next image
   */
  next,
  /**
   * @zh-CN 执行缩放或旋转操作
   * @en-US Perform zoom or rotate action
   */
  handleActions,
  /**
   * @zh-CN 重置缩放、位移与旋转状态
   * @en-US Reset zoom, offset, and rotation state
   */
  resetTransform,
});
</script>
<template>
  <OLayer
    ref="rootRef"
    v-model:visible="visible"
    class="o-image-viewer"
    :tabindex="props.focusTrap ? -1 : undefined"
    main-class="o-image-viewer-body"
    v-bind="{
      ...DEFAULT_LAYER_OPTIONS,
      ...(props.layerOptions || {}),
    }"
    @change="onLayerChange"
  >
    <slot name="preview" :src="currentUrl">
      <!-- 预览内容包裹层 -->
      <div class="o-image-viewer-wrapper" :class="props.wrapperClass">
        <!-- 图片包裹元素（图层 — 承载缩放/旋转/拖拽 transform） -->
        <div
          ref="imageWrapperRef"
          class="o-image-viewer-container"
          :class="[props.containerClass, { 'o-image-viewer-dragging': isDragging, [slideClass]: true }]"
          :style="containerStyle"
          @click="onContainerClick"
        >
          <Transition :name="imageTransitionName" mode="out-in">
            <!-- 图片加载错误 -->
            <div v-if="loadError" :key="`error-${currentIndex}`" class="o-image-viewer-error" @click="retry">
              <slot name="error" :active-index="currentIndex" :src="currentUrl">
                <component :is="IconImageError" class="o-image-viewer-error-icon" />
                <span class="o-image-viewer-error-text">{{ t('imageViewer.error') }}</span>
              </slot>
            </div>
            <img
              v-else
              ref="imgRef"
              :key="`${currentIndex}-${imgKey}`"
              class="o-image-viewer-img"
              :src="currentUrl"
              :alt="currentUrl"
              :crossorigin="props.crossorigin || undefined"
              @load="onImgLoaded"
              @error="onImgError"
            />
          </Transition>
        </div>
        <!-- 默认插槽（preview-extra），渲染在图片容器外、预览包裹层内 -->
        <slot></slot>
      </div>

      <!-- UI 操作层（相对整个查看器框定位，通过 z-index 位于图层之上） -->
      <div class="o-image-viewer-overlay">
        <!-- 上一张（触摸紧凑屏由 CSS display:none 隐藏，swipe 替代） -->
        <OButton
          v-if="canNavigate"
          class="o-image-viewer-nav o-image-viewer-nav-prev"
          :disabled="!hasPrev"
          :aria-label="t('imageViewer.prev')"
          :icon="IconChevronLeft"
          variant="solid"
          size="large"
          round="pill"
          @click="prev"
        />

        <!-- 下一张（触摸紧凑屏由 CSS display:none 隐藏，swipe 替代） -->
        <OButton
          v-if="canNavigate"
          class="o-image-viewer-nav o-image-viewer-nav-next"
          :disabled="!hasNext"
          :aria-label="t('imageViewer.next')"
          :icon="IconChevronRight"
          variant="solid"
          size="large"
          round="pill"
          @click="next"
        />

        <!-- 缩放比例提示 -->
        <Transition name="o-image-zoom-ratio">
          <div v-show="showZoomRatio" class="o-image-zoom-ratio">{{ zoomRatio }}</div>
        </Transition>

        <!-- 进度指示器 -->
        <div v-if="props.showProgress || $slots.progress" class="o-image-viewer-progress">
          <slot name="progress" :active-index="currentIndex" :total="props.previewList.length">
            {{ progress }}
          </slot>
        </div>

        <!-- 操作区 -->
        <div v-if="showActionAreaComputed" class="o-image-viewer-action" @click.stop>
          <slot
            name="toolbar"
            :actions="handleActions"
            :prev="prev"
            :next="next"
            :reset="resetTransform"
            :active-index="currentIndex"
            :set-active-item="setActiveItem"
          >
            <template v-for="item in toolbarItems" :key="item">
              <button type="button" class="o-image-action-item" :aria-label="toolbarLabelMap[item]" @click="onToolbarItem(item)">
                <component :is="toolbarIconMap[item]" class="o-image-action-icon" />
              </button>
            </template>
          </slot>
        </div>
      </div>
    </slot>
  </OLayer>
</template>
