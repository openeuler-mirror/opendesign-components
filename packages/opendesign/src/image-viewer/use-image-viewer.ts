import { defineComponent, getCurrentScope, h, onScopeDispose, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue';
import { watchPausable } from '@vueuse/core';
import { type MountHandle, useRenderWithCtx } from '../hooks';
import { isClient } from '../_utils/is';
import OImageViewer from './OImageViewer.vue';
import { DEFAULT_LAYER_OPTIONS, type ImageViewerLayerOptions, type ImageViewerPropsT } from './types';

/**
 * 事件回调集合
 * @description 与 OImageViewer 的 emits 一一对应，用于函数式调用场景下的事件监听。
 * 回调为普通函数类型，在每次事件触发时直接调用。
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
 * Composable 专属选项
 * @description 这些选项仅控制 `useImageViewer` 的行为，不透传给 `OImageViewer` 组件。
 */
export interface ImageViewerComposableOptions {
  /**
   * 关闭时是否自动销毁挂载实例
   * @description
   * - `true`：`close()` 时卸载底层挂载实例并释放 DOM，下次 `open()` 重新挂载。
   * - `false`：`close()` 仅切换 `visible = false`，保留挂载实例以便复用。
   * - 默认值：在 effect scope 内（如 `setup`）为 `false`，在作用域外为 `true`。
   */
  autoDestroyOnClose?: boolean;
}

/**
 * 函数式调用选项
 * @description
 * - 值类型 props（`previewList` / `currentIndex` / `zoomRate` 等）支持 `MaybeRefOrGetter`，
 *   可传 `ref` / `getter` / 原始值；源变化时正在显示的预览会响应式同步。
 * - 事件回调为普通函数，在事件触发时直接调用。
 * - `visible` 由 hook 内部维护的 ref 控制，不在此处传入。
 * - `autoDestroyOnClose` 为 composable 专属选项，不透传给 `OImageViewer`。
 */
export type UseImageViewerOptions = Partial<{
  [K in keyof ImageViewerPropsT]: MaybeRefOrGetter<ImageViewerPropsT[K]>;
}> &
  ImageViewerCallbacks &
  ImageViewerComposableOptions;

/**
 * 函数式调用返回句柄
 */
export interface ImageViewerHandle {
  /**
   * 当前可见状态
   * @description 由 hook 内部维护的 ref，调用方可通过 `v-model` 或直接赋值外部控制开关。
   * 在 effect scope 内调用时，`open` / `close` 只切换此 ref，复用底层挂载实例。
   */
  visible: Ref<boolean>;
  /**
   * 打开预览
   * @description 幂等：已打开时为 no-op。首次调用时懒挂载底层实例，之后仅切换 `visible`。
   */
  open: () => void;
  /**
   * 关闭预览
   * @description 幂等：未打开时为 no-op。
   * - `autoDestroyOnClose` 为 `false` 时：仅切换 `visible = false`，保留挂载实例以便复用。
   * - `autoDestroyOnClose` 为 `true` 时：卸载底层挂载实例并释放 DOM，下次 `open()` 重新挂载。
   * - 默认值：effect scope 内为 `false`，作用域外为 `true`。
   * 无论哪种模式，均会触发 `onClose` 回调（仅当本次会话尚未触发过时）。
   */
  close: () => void;
  /**
   * 彻底卸载实例
   * @description 无论是否在 effect scope 内，均卸载底层挂载实例并释放 DOM。
   * 若当前预览处于打开状态，会先触发 `onClose` 回调。
   * 在 effect scope 内，宿主 scope 销毁时会自动调用此方法。
   */
  unmount: () => void;
}

/**
 * 回调属性名集合
 * @description 用于区分回调与值 props：回调直接注入到 resolvedProps，
 * 值 props 在 render 期间通过 `toValue` 解包并建立响应式追踪。
 */
const CALLBACK_KEYS: ReadonlySet<string> = new Set(['onClose', 'onSwitch', 'onError', 'onRotate', 'onZoomDrag']);

/**
 * Composable 专属选项属性名集合
 * @description 这些选项仅控制 `useImageViewer` 的行为，不透传给 `OImageViewer` 组件，
 * 在 render 时跳过。
 */
const COMPOSABLE_OPTION_KEYS: ReadonlySet<string> = new Set(['autoDestroyOnClose']);

/**
 * 会话状态机
 * @description 管理 `onClose` 的触发时机与幂等性：
 * - `idle`：从未打开，或刚 `unmount` 后重置
 * - `open`：当前处于打开状态
 * - `closed`：本次会话已关闭（`onClose` 已触发）
 *
 * `open()` 从 `idle`/`closed` 转入 `open`；`fireOnClose()` 从 `open` 转入 `closed`；
 * `unmount()` 从任意状态重置回 `idle`。
 */
type SessionState = 'idle' | 'open' | 'closed';

/**
 * 创建 Wrapper 组件的 render 函数
 * @description 在 render 内读取所有响应式源并组装 props，建立依赖追踪。
 * 源变化时 Vue 自动重渲染 Wrapper，把新 props 传给 OImageViewer，
 * 实现"挂载一次、props 响应式更新"。
 *
 * @param options 用户传入的选项（值 props 支持 MaybeRefOrGetter，回调为普通函数）
 * @param visible hook 内部维护的可见状态 ref
 * @param fireOnClose 状态机保护的 onClose 触发器
 * @returns Wrapper 组件的 render 函数
 */
function createWrapperRender(options: UseImageViewerOptions, visible: Ref<boolean>, fireOnClose: () => void) {
  return () => {
    const resolvedProps: Record<string, any> = {};

    // 值类型 props（非回调、非 layerOptions、非 composable 选项）— 通过 toValue 解包
    for (const key of Object.keys(options)) {
      if (key === 'layerOptions') continue;
      if (CALLBACK_KEYS.has(key)) continue; // 回调在下面单独注入
      if (COMPOSABLE_OPTION_KEYS.has(key)) continue; // composable 专属选项，不透传给组件
      const raw = (options as Record<string, unknown>)[key];
      if (raw == null) {
        resolvedProps[key] = raw;
        continue;
      }
      resolvedProps[key] = toValue(raw as MaybeRefOrGetter<unknown>);
    }

    // layerOptions 合并默认值（同样支持 MaybeRefOrGetter）
    const userLayerRaw = (options as { layerOptions?: MaybeRefOrGetter<ImageViewerLayerOptions> }).layerOptions;
    const userLayer = userLayerRaw != null ? toValue(userLayerRaw) : undefined;
    resolvedProps.layerOptions = {
      ...DEFAULT_LAYER_OPTIONS,
      ...(userLayer ?? {}),
    };

    // visible 双向绑定：传当前值 + 监听 update:visible 回写 ref
    resolvedProps.visible = visible.value;
    resolvedProps['onUpdate:visible'] = (val: boolean) => {
      visible.value = val;
    };

    // onClose 桥接：内部触发关闭 + 触发用户回调（经状态机幂等保护）
    resolvedProps.onClose = () => {
      visible.value = false;
      fireOnClose();
    };

    // 其他事件透传 — 直接调用用户传入的回调
    resolvedProps.onSwitch = (i: number) => options.onSwitch?.(i);
    resolvedProps.onError = (e: Event) => options.onError?.(e);
    resolvedProps.onRotate = (d: number) => options.onRotate?.(d);
    resolvedProps.onZoomDrag = (v: boolean) => options.onZoomDrag?.(v);

    return h(OImageViewer, resolvedProps);
  };
}

/**
 * 函数式图片预览 Composable
 *
 * @description
 * 通过 `mountWithCtx` 在组件树外挂载 OImageViewer，并以 composable 形式暴露
 * `open` / `close` / `unmount` 三个命令式方法及 `visible` 响应式 ref。
 *
 * - **响应式 props**：值类型 props 支持 `ref` / `getter` / 原始值，源变化时正在显示的
 *   预览会响应式同步（如 `previewList` 变化会反映到打开的预览中）。
 * - **复用实例**：`autoDestroyOnClose` 为 `false` 时（effect scope 内默认），
 *   `open` / `close` 只切换 `visible` ref，底层挂载实例复用，避免反复创建销毁。
 *   宿主 scope 销毁时自动 `unmount`。
 * - **关闭即销毁**：`autoDestroyOnClose` 为 `true` 时（effect scope 外默认），
 *   `close` 卸载底层挂载实例并释放 DOM，下次 `open()` 重新挂载。
 *   作用域外调用时，`close` 还会暂停内部 watch 以防 watcher 泄漏；下次 `open()` 恢复监听。
 * - **上下文继承**：在组件 `setup` 中调用时，自动获取当前组件的 `appContext` 与 `provides`，
 *   让挂载实例能访问 `OConfigProvider` 注入、Pinia、Router 等。在 effect scope 内但非 `setup`
 *   场景（如手动 `effectScope()`）调用时，`getCurrentInstance()` 返回 `null`，上下文无法捕获，
 *   `mountWithCtx` 会降级挂载（不嫁接 appContext），挂载的组件可能无法 inject——此时需手动调用
 *   `unmount()` 清理，因为 `onUnmounted` 无法注册。
 * - **SSR 安全**：服务端 `open` / `close` / `unmount` 均为 no-op。
 * - **幂等**：`open` 已打开时为 no-op，`close` 未打开时为 no-op。
 * - `onClose` 回调在以下场景触发（每次 open→close 会话仅触发一次）：
 *   - 内部交互（关闭按钮 / ESC / 遮罩点击）
 *   - 外部调用 `close()`
 *   - 外部调用 `unmount()`（仅当当前处于打开状态）
 *   - 宿主 scope 销毁时自动 `unmount`（仅当当前处于打开状态）
 * - `layerOptions` 默认为 `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }`，
 *   与组件场景一致。
 *
 * @param options 预览选项，值 props 支持 `MaybeRefOrGetter`，回调为普通函数，
 *   `autoDestroyOnClose` 控制关闭时是否自动销毁实例
 * @returns `{ visible, open, close, unmount }` 句柄
 *
 * @example
 * ```ts
 * // 在 setup 中调用 — 复用模式（autoDestroyOnClose 默认 false）
 * const list = ref(['a.png', 'b.png']);
 * const idx = ref(0);
 * const { visible, open, close } = useImageViewer({
 *   previewList: list,            // 直接传 ref
 *   currentIndex: () => idx.value, // 或 getter
 *   zoomRate: 1.2,                 // 或原始值
 *   onClose: () => console.log('closed'),
 * });
 * open();
 * list.value.push('c.png'); // 打开中的预览会响应式更新
 * visible.value = false;    // 等价于 close()
 * ```
 *
 * @example
 * ```ts
 * // 在 effect scope 外调用 — 关闭即销毁（autoDestroyOnClose 默认 true）
 * const { open, close } = useImageViewer({ previewList: ['a.png'] });
 * open();  // 挂载实例 + 显示
 * close(); // 卸载实例（不复用）
 * ```
 *
 * @example
 * ```ts
 * // 在 effect scope 内显式开启关闭即销毁
 * const { open, close } = useImageViewer({
 *   previewList: ['a.png'],
 *   autoDestroyOnClose: true,
 * });
 * open();
 * close(); // 卸载实例，下次 open() 重新挂载
 * ```
 */
export function useImageViewer(options: UseImageViewerOptions): ImageViewerHandle {
  // SSR 安全：非客户端环境下返回 no-op 句柄，visible 为独立 ref 供调用方读取
  if (!isClient) {
    return {
      visible: ref(false),
      open: () => {},
      close: () => {},
      unmount: () => {},
    };
  }
  const { mountWithCtx } = useRenderWithCtx();

  /** hook 内部维护的可见状态 ref */
  const visible = ref(false);

  /** 是否在 effect scope 内（setup / 手动 effectScope）—— 决定 close 语义 */
  const hasScope = !!getCurrentScope();

  /**
   * 关闭时是否自动销毁挂载实例
   * @description 未显式传入时，effect scope 内默认 `false`（复用实例），
   * 作用域外默认 `true`（关闭即销毁）。
   */
  const autoDestroyOnClose = options.autoDestroyOnClose ?? !hasScope;

  /** 当前会话状态（管理 onClose 触发时机与幂等性） */
  let sessionState: SessionState = 'idle';

  /**
   * 触发 onClose 回调
   * @description 仅当 `sessionState === 'open'` 时触发，触发后转入 `closed`。
   * 保证每次 open→close 会话仅触发一次，避免内部关闭 + 外部 close/unmount 重复触发。
   */
  const fireOnClose = () => {
    if (sessionState !== 'open') return;
    sessionState = 'closed';
    options.onClose?.();
  };

  /**
   * 内部 Wrapper 组件
   * @description render 函数在 effect 内读取所有响应式源，建立依赖追踪。
   * 源变化时 Vue 自动重渲染 Wrapper，把新 props 传给 OImageViewer，
   * 实现"挂载一次、props 响应式更新"。渲染逻辑由 `createWrapperRender` 提供。
   */
  const WrapperComp = defineComponent({
    name: 'OImageViewerWrapper',
    setup: () => createWrapperRender(options, visible, fireOnClose),
  });

  /** 底层挂载实例句柄（懒创建） */
  let handle: MountHandle | null = null;

  /**
   * 确保底层实例已挂载
   * @description 首次调用时通过 mountWithCtx 挂载 WrapperComp，传入解析出的 appContext。
   * 后续调用为 no-op，复用同一实例。
   */
  const ensureMounted = () => {
    if (handle) return;
    handle = mountWithCtx(WrapperComp);
  };

  /**
   * 彻底卸载底层实例
   * @description 幂等：未挂载时为 no-op。卸载后 handle 置 null，下次 open 会重新挂载。
   */
  const doUnmount = () => {
    if (!handle) return;
    handle.unmount();
    handle = null;
  };

  /**
   * visible 变化监听（可暂停）
   * @description 使用 VueUse `watchPausable` 创建可暂停的 sync watch，让 `visible` ref
   * 真正双向化——调用方直接赋值 `visible.value = true/false` 等价于调用 `open()` / `close()`：
   * - `true`：确保挂载 + 进入 `open` 会话状态
   * - `false`：触发 `onClose`（经状态机幂等保护）；`autoDestroyOnClose` 为 `true` 时
   *   卸载实例并重置为 `idle`；作用域外额外暂停 watch 以防 watcher 泄漏
   *
   * 使用 `flush: 'sync'` 确保赋值后立即生效，避免同 tick 内连续 open→close 被批合并丢失。
   *
   * **可暂停设计**：作用域外（`!hasScope`）无 `onScopeDispose` 回收 watch，内部关闭路径
   * （关闭按钮 / ESC / 遮罩点击）不经过 `close()`，需在 watch 回调内暂停自身以防泄漏。
   * 使用 `pause()` 而非 `stop()`：`open()` 可通过 `resume()` 恢复监听，确保下次内部关闭
   * 仍能经过 watch 路径执行 `doUnmount()`，避免实例泄漏。`unmount()` 中调用 `stop()` 彻底销毁。
   */
  const {
    pause: pauseWatch,
    resume: resumeWatch,
    stop: stopWatch,
  } = watchPausable(
    visible,
    (val) => {
      if (val) {
        if (sessionState !== 'open') {
          ensureMounted();
          sessionState = 'open';
        }
      } else {
        fireOnClose();
        if (autoDestroyOnClose) {
          doUnmount();
          sessionState = 'idle';
          // 作用域外无 onScopeDispose 回收 watch：内部关闭路径（关闭按钮 / ESC / 遮罩点击）
          // 不经过 close()，需在此处暂停 watch 自身，防止 watcher 泄漏。
          // 使用 pause() 而非 stop()：下次 open() 可通过 resume() 恢复，确保后续内部关闭
          // 仍能经过 watch 执行 doUnmount()。
          if (!hasScope) {
            pauseWatch();
          }
        }
      }
    },
    { flush: 'sync' },
  );

  /**
   * 打开预览
   * @description 幂等：`sessionState === 'open'` 时为 no-op。
   * 首次调用或 `unmount` 后重新调用时懒挂载底层实例，之后仅切换 `visible = true`。
   * 调用 `resumeWatch()` 恢复内部 watch：作用域外 `close()` 或内部关闭暂停了 watch，
   * 此处恢复以确保后续内部关闭（关闭按钮 / ESC / 遮罩点击）仍能经过 watch 路径执行卸载。
   */
  const open = () => {
    if (sessionState === 'open') return;
    ensureMounted();
    sessionState = 'open';
    resumeWatch();
    visible.value = true;
  };

  /**
   * 关闭预览
   * @description 幂等：`sessionState !== 'open'` 时为 no-op。
   * - `autoDestroyOnClose` 为 `true` 时：`visible = false` 触发 sync watch 同步卸载实例，
   *   此处 `doUnmount` 为幂等 no-op；watch 已暂停时则由本调用实际执行卸载。
   * - `autoDestroyOnClose` 为 `false` 时：仅 `visible = false`，保留挂载实例以便复用。
   * - 作用域外（无 `onScopeDispose` 回收 watch）：额外调用 `pauseWatch()` 暂停内部 watch，
   *   防止 watcher 泄漏。watch 暂停后，外部赋值 `visible.value` 不再触发副作用；
   *   重新打开需调用 `open()`（内部调用 `resumeWatch()` 恢复监听）。
   * 无论哪种模式，均通过 `fireOnClose` 触发 `onClose` 回调（状态机保证仅触发一次）。
   */
  const close = () => {
    if (sessionState !== 'open') return;
    visible.value = false;
    if (autoDestroyOnClose) {
      // sync watch（flush:'sync'）已在 visible.value = false 时同步执行 doUnmount + fireOnClose，
      // 此处 doUnmount 为幂等 no-op；watch 已暂停时则由本调用实际执行卸载
      doUnmount();
    }
    if (!hasScope) {
      // 作用域外无 onScopeDispose 回收 watch，需手动暂停以防 watcher 泄漏
      pauseWatch();
    }
    fireOnClose();
  };

  /**
   * 彻底卸载实例
   * @description 无论是否在 effect scope 内，均卸载底层挂载实例并释放 DOM。
   * 若当前处于打开状态（`sessionState === 'open'`），先触发 `onClose` 回调。
   * 卸载后状态重置为 `idle`，`visible` 重置为 `false`，并彻底停止 visible 监听（`stop()`）。
   * 下次 `open` 会重新挂载并通过 `resumeWatch()` 恢复监听。
   */
  const unmount = () => {
    fireOnClose();
    doUnmount();
    sessionState = 'idle';
    visible.value = false;
    stopWatch();
  };

  // 在 effect scope 内：宿主 scope 销毁时自动卸载，避免实例泄漏
  if (hasScope) {
    onScopeDispose(unmount);
  }

  return { visible, open, close, unmount };
}
