import { type AppContext, type Component, type VNode, cloneVNode, getCurrentInstance, h, isVNode, onUnmounted, render } from 'vue';
import { isClient } from '../_utils/is';
import { Log } from '../_utils/log';

/**
 * @description Vue 内部实例类型扩展，补充公开类型未暴露的 provides 属性。
 * provides 是组件级注入链，包含 configProviderInjectKey 等组件树内的 provide，
 * 其原型链同时指向 appContext.provides（app 级注入：Pinia / Router / i18n 等）。
 */
type InternalInstance = NonNullable<ReturnType<typeof getCurrentInstance>> & {
  provides: Record<string | symbol, unknown>;
};

/** @description useRenderWithCtx 专用日志实例 */
const ctxLog = new Log('useRenderWithCtx');

/**
 * @description 在 setup 同步期从 getCurrentInstance 捕获上下文快照，合并 appContext + provides
 * - instance.provides 的原型链已包含 appContext.provides（app 级注入），
 *   合并后挂载的组件能同时访问组件级注入（configProviderInjectKey 等）与 app 级注入（Pinia/Router/i18n）
 * - 实例为 null 时静默返回 null；实际的警告在 renderWithCtx 调用时按次输出
 * @param instance getCurrentInstance 获取的组件实例
 * @returns 合并后的 AppContext，或 null
 */
function captureContext(instance: ReturnType<typeof getCurrentInstance>): AppContext | null {
  if (!instance) return null;
  const internal = instance as InternalInstance;
  return { ...internal.appContext, provides: internal.provides };
}

/**
 * @description mountWithCtx 的挂载选项
 */
export type MountOptions = {
  /** 用户自备容器；不传则自动创建 div 并 append 到 body */
  container?: HTMLElement;
  /** 卸载回调，在 unmount() 内部 render(null) 之后、container.remove() 之前调用 */
  onUnmount?: () => void;
};

/**
 * @description mountWithCtx 的返回句柄
 */
export type MountHandle = {
  /** 挂载的 VNode（克隆后渲染的 vnode，已设置 appContext，el/component 已填充） */
  vnode: VNode;
  /** 挂载容器元素 */
  container: HTMLElement;
  /** 卸载并清理：render(null) + container.remove() + 触发 onUnmount 回调 */
  unmount: () => void;
};

/**
 * @description renderWithCtx 的返回值，用对象包裹以防后续增加返回字段
 */
export type RenderResult = {
  /** 克隆并渲染后的 VNode；vnode 入参为 null（卸载场景）或 SSR 时为 null */
  vnode: VNode | null;
};

/**
 * @description 在组件 setup 作用域中调用，捕获当前实例的 appContext + provides，
 * 返回的 renderWithCtx / mountWithCtx 可在事件回调、异步代码等非 setup 作用域中安全使用，
 * 无需依赖 getCurrentInstance 或 OConfigProvider 的全局闭包 getter 注册机制。
 *
 * 上下文在 setup 同步期被闭包捕获，后续无论在何处调用（setTimeout、事件回调、异步函数），
 * 均使用同一份上下文快照，保证挂载的组件能正确 inject 组件级与 app 级注入。
 *
 * 副作用回收：mountWithCtx 创建的每个挂载实例均被内部追踪，宿主组件卸载时通过
 * onUnmounted 自动调用 cleanup 统一清理（render(null) + container.remove），
 * 无需手动管理；亦可在运行期手动调用 cleanup 提前回收全部挂载。
 *
 * @returns 包含 renderWithCtx、mountWithCtx、cleanup 的对象，三者均闭包引用 setup 期捕获的上下文
 */
export function useRenderWithCtx() {
  // 在 setup 同步期捕获实例与上下文，后续调用不再依赖 getCurrentInstance
  const instance = getCurrentInstance();
  const ctx = captureContext(instance);

  /**
   * @description 由 mountWithCtx 创建的挂载句柄集合，供 cleanup 统一清理。
   * 手动调用 handle.unmount() 时自动从中移除，避免持有已卸载句柄的引用。
   */
  const mountHandles = new Set<MountHandle>();

  /**
   * @description 兼容 Vue 原生 render(vnode, container) 签名的上下文继承渲染函数。
   * 在挂载 VNode 前自动为其嫁接 setup 期捕获的 appContext + provides，
   * 使得在组件树外（函数式弹窗、命令式 API、事件回调）挂载的组件仍能正常使用 inject、Pinia、Router 等。
   * - 服务端返回 { vnode: null }，不触碰 document
   * - vnode 为 null 时直接 render(null, el) 并返回 { vnode: null }（卸载场景）
   * - 使用 cloneVNode 克隆后设置 appContext，不修改调用方原始 vnode
   * - 返回值用对象包裹，以防后续增加返回字段
   * @param vnode VNode 或 null（卸载场景）
   * @param container 挂载容器元素
   * @returns RenderResult，其 vnode 字段为克隆并渲染后的 VNode；vnode 为 null 时为 null；SSR 为 null
   */
  function renderWithCtx(vnode: VNode | null, container: HTMLElement): RenderResult {
    if (!isClient) return { vnode: null };
    if (vnode === null) {
      render(null, container);
      return { vnode: null };
    }
    // ctx 为 null 说明 hook 未在 setup 作用域中调用，每次渲染时提醒
    if (!ctx) {
      ctxLog.warn('useRenderWithCtx 未捕获到上下文，本次渲染将无法嫁接 appContext + provides，挂载的组件可能无法 inject。');
    }
    const cloned = cloneVNode(vnode);
    // 嫁接 setup 期捕获的 appContext + provides，使组件树外挂载的组件可使用 inject/Pinia/Router
    if (ctx) cloned.appContext = ctx;
    render(cloned, container);
    return { vnode: cloned };
  }

  /**
   * @description 高层封装：创建 VNode → renderWithCtx 挂载 → 返回 MountHandle
   * - 服务端返回 null，不触碰 document
   * - ctx 为 null 时仍可挂载（降级，不嫁接上下文），但 onUnmounted 无法注册，
   *   挂载实例不会被自动回收——输出警告，用户须手动调用 handle.unmount() 清理
   * - 客户端：VNode 直接使用，Component 则经 h() 创建 VNode
   * - 返回的句柄被内部追踪：手动调用 handle.unmount() 自动从追踪集合移除；
   *   未手动卸载的句柄由 cleanup 统一回收（ctx 为 null 时需手动调用 cleanup）
   * - unmount 时：render(null) + container.remove() + onUnmount 回调
   *   无论自动容器还是用户自备容器，均移除 DOM
   * - MountHandle 本身已是对象，后续增加返回字段直接扩展 MountHandle 即可
   * @param input Vue 组件或 VNode
   * @param props 组件 props（仅当 input 为 Component 时生效）
   * @param options 挂载选项（container / onUnmount）
   * @returns 客户端时返回 MountHandle，服务端返回 null
   */
  const mountWithCtx = (input: Component | VNode, props?: Record<string, any>, options?: MountOptions): MountHandle | null => {
    if (!isClient) return null;
    // ctx 为 null 说明 hook 未在 setup 作用域中调用，onUnmounted 无法注册，
    // 挂载实例不会被自动回收——仍允许挂载，但用户须手动调用 handle.unmount() 清理
    if (!ctx) {
      ctxLog.warn('useRenderWithCtx 未捕获到上下文，自动清理不可用。可能导致内存泄漏，请在合适的时机手动调用 cleanup() 清理。');
    }

    // VNode → 直接使用；Component → 通过 h() 创建 VNode
    const vnode = isVNode(input) ? input : h(input as Component, props);
    // 容器未提供则自动创建并 append 到 body
    const container = options?.container ?? document.createElement('div');
    if (!options?.container) document.body.appendChild(container);

    const rendered = renderWithCtx(vnode, container);
    let unmounted = false;

    const handle: MountHandle = {
      vnode: rendered.vnode!, // vnode 永远非 null（由 input: Component | VNode 保证）
      container,
      unmount: () => {
        if (unmounted) return;
        unmounted = true;
        render(null, container);
        options?.onUnmount?.();
        container.remove();
        // 从追踪集合中移除，避免持有已卸载句柄的引用
        mountHandles.delete(handle);
      },
    };
    mountHandles.add(handle);

    return handle;
  };

  /**
   * @description 清除所有由 mountWithCtx 创建的挂载实例，统一回收副作用。
   * - 遍历内部句柄集合，逐个调用 unmount()（render(null) + container.remove() + onUnmount 回调）
   * - 已卸载的句柄因内部 unmounted 标志而安全跳过，不会重复清理
   * - 清空集合释放引用
   * - 宿主组件卸载时通过 onUnmounted 自动调用，也可手动调用
   */
  const cleanup = () => {
    for (const handle of mountHandles) {
      handle.unmount();
    }
    // 防御性清空，处理已手动 unmount 但因竞态仍在集合中的残留
    mountHandles.clear();
  };

  // 宿主组件卸载时自动清理，防止脱离组件树后 DOM 泄漏
  if (instance) {
    onUnmounted(cleanup);
  }

  return { renderWithCtx, mountWithCtx, cleanup };
}

/** @description useRenderWithCtx 返回值，由函数声明自动推导 */
export type UseRenderWithCtxReturn = ReturnType<typeof useRenderWithCtx>;

/** @description 上下文继承渲染函数类型，从函数签名自动推导 */
export type RenderWithCtx = UseRenderWithCtxReturn['renderWithCtx'];

/** @description 上下文继承挂载函数类型，从函数签名自动推导 */
export type MountWithCtx = UseRenderWithCtxReturn['mountWithCtx'];
