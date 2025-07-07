import { isFunction } from '../_utils/is';

/**
 * 监听池
 * isFirst: 监听的第一次回调
 */
const observerPool = new WeakMap<
  HTMLElement,
  {
    element: HTMLElement;
    isFirst: boolean; // 初次监听时会触发一次回调
    callbacks: Array<(entry: ResizeObserverEntry, isFirst: boolean) => void>;
  } | null
>();

// 创建监听实例
interface ObserveInstance {
  observer: ResizeObserver;
  record: number;
}

let instance: ObserveInstance | null = null;
function createObserverInstance() {
  if (!instance) {
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        const ele = entry.target as HTMLElement;
        const ins = observerPool.get(ele);
        if (!ins) {
          return;
        }

        ins?.callbacks?.forEach((fn) => fn(entry, ins.isFirst));

        if (ins.isFirst) {
          ins.isFirst = false;
        }
      });
    });

    instance = {
      observer,
      record: 0,
    };
  }
  return instance;
}
export type ResizeListenerT = (entry: ResizeObserverEntry, isFirst: boolean) => void;
/**
 * 创建元素尺寸变化监听器，
 */
export function useResizeObserver() {
  // 创建监听实例
  const instance = createObserverInstance();

  return {
    /**
     * 监听实例
     */
    observer: instance,
    /**
     * 创建监听实例
     * el: 监听元素
     * listener: resize回调, 移除监听时需要指定该监听函数
     */
    observe: (el: HTMLElement, listener: (entry: ResizeObserverEntry, isFirst: boolean) => void) => {
      if (!el || !isFunction(listener)) {
        return null;
      }

      // 同一元素，只创建一次ResizeObserver，通过数组存储回调
      const val = observerPool.get(el);
      if (val) {
        val.callbacks.push(listener);
      } else {
        instance.observer.observe(el);
        instance.record++;

        observerPool.set(el, {
          element: el,
          callbacks: [listener],
          isFirst: true,
        });
      }

      return instance;
    },
    /**
     * 移除监听
     * el: 要移除监听的元素
     * listener: 要移除的监听函数，如果不传，则使用初始化时的onResize回调
     */
    unobserve: (el: HTMLElement, listener: (entry: ResizeObserverEntry, isFirst: boolean) => void) => {
      if (!el || !isFunction(listener) || !instance) {
        return;
      }

      const val = observerPool.get(el);

      if (val) {
        const idx = val.callbacks.indexOf(listener);
        val.callbacks.splice(idx, 1);

        // 当el无监听回调时，不再监听该元素
        if (val.callbacks.length === 0) {
          instance.observer.unobserve(el);
          observerPool.delete(el);
          instance.record--;

          // 当无需要监听的元素，就断开
          if (instance.record === 0) {
            instance.observer.disconnect();
          }
        }
      }
    },
    destroy() {
      instance.observer.disconnect();
    },
  };
}
