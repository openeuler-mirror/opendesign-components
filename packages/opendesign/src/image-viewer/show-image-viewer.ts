import { mountWithCtx, type MountHandle } from '../_utils/vue-utils';
import OImageViewer from './OImageViewer.vue';
import type { ImageViewerPropsT, ImageViewerLayerOptions } from './types';

/**
 * 事件回调集合
 * @description 与 OImageViewer 的 emits 一一对应，用于函数式调用场景下的事件监听
 */
export interface ImageViewerCallbacks {
  /** 关闭预览时触发 */
  onClose?: () => void;
  /** 预览图片切换时触发，返回切换后的索引 */
  onSwitch?: (index: number) => void;
  /** 图片加载失败时触发 */
  onError?: (evt: Event) => void;
  /** 图片旋转时触发，返回当前旋转角度 */
  onRotate?: (deg: number) => void;
  /** 图片拖拽状态变化时触发，true 表示发生了拖拽，false 表示仅为点击 */
  onZoomDrag?: (value: boolean) => void;
}

/**
 * 函数式调用选项
 * @description 继承组件全部 props（visible 除外，由函数内部管理），
 * 叠加事件回调。layerOptions 在函数式场景下默认启用遮罩层与关闭按钮。
 */
export type ShowImageViewerOptions = Partial<Omit<ImageViewerPropsT, 'visible'>> & ImageViewerCallbacks;

/**
 * 函数式调用返回句柄
 */
export interface ImageViewerHandle {
  /** 关闭并销毁预览，多次调用安全（幂等） */
  close: () => void;
}

/**
 * 函数式场景下 layerOptions 的默认值
 * @description 独立浮层场景需要遮罩层、关闭按钮，并 teleport 到 body
 */
const DEFAULT_FUNCTIONAL_LAYER_OPTIONS: ImageViewerLayerOptions = {
  mask: true,
  maskClose: true,
  buttonClose: true,
  wrapper: 'body',
};

/**
 * 函数式图片预览
 *
 * @description 通过 `mountWithCtx` 在组件树外挂载 OImageViewer，
 * 无需在模板中声明即可命令式地打开图片预览。
 *
 * - 客户端返回 `ImageViewerHandle`，服务端返回 `null`（SSR 安全）
 * - 内部交互（关闭按钮 / ESC / 遮罩点击）或外部调用 `handle.close()` 均触发卸载
 * - `onClose` 回调仅触发一次，由 `closed` 标志位保证
 * - `layerOptions` 默认为 `{ mask: true, maskClose: true, buttonClose: true, wrapper: 'body' }`
 *
 * @param options 预览选项，继承组件 props（visible 除外）并叠加事件回调
 * @returns 客户端返回 `ImageViewerHandle`，服务端返回 `null`
 *
 * @example
 * ```ts
 * const handle = showImageViewer({
 *   previewList: ['https://example.com/a.png'],
 *   initialIndex: 0,
 *   onClose: () => console.log('closed'),
 * });
 * // 手动关闭
 * handle?.close();
 * ```
 */
export function showImageViewer(options: ShowImageViewerOptions): ImageViewerHandle | null {
  const { onClose, onSwitch, onError, onRotate, onZoomDrag, layerOptions, ...componentProps } = options;

  /** 合并默认 layerOptions 与用户传入值 */
  const mergedLayerOptions: ImageViewerLayerOptions = {
    ...DEFAULT_FUNCTIONAL_LAYER_OPTIONS,
    ...layerOptions,
  };

  let handle: MountHandle | null = null;
  /** 关闭标志位，保证 unmount 和 onClose 回调仅执行一次 */
  let closed = false;

  /**
   * 关闭并销毁预览
   * @description 无论由内部交互（关闭按钮 / ESC / 遮罩点击）还是外部手动调用触发，
   * 均执行 unmount 并回调 onClose。`closed` 标志位保证幂等。
   */
  const close = () => {
    if (closed) return;
    closed = true;
    handle?.unmount();
    onClose?.();
  };

  handle = mountWithCtx(OImageViewer, {
    ...componentProps,
    visible: true,
    layerOptions: mergedLayerOptions,
    onClose: close,
    onSwitch,
    onError,
    onRotate,
    onZoomDrag,
    'onUpdate:visible': (val: boolean) => {
      if (!val) close();
    },
  });

  if (!handle) return null;

  return { close };
}
