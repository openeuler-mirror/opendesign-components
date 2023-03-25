// import IntersectionObserver from 'intersection-observer-polyfill';
import { isFunction } from '../_shared/is';

export type IntersectionListenerT = (entry: IntersectionObserverEntry) => void;

/**
 * 监听池
 * isFirst: 监听的第一次回调
 */
const observerPool = new WeakMap<
  HTMLElement,
  {
    element: HTMLElement;
    callbacks: Array<IntersectionListenerT>;
  } | null
>();

// 创建监听实例
const instance = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    const ele = entry.target as HTMLElement;
    const ins = observerPool.get(ele);

    if (!ins) {
      return;
    }

    ins?.callbacks?.forEach((fn) => fn(entry));
  });
});

/**
 * 监听元素尺寸变化，
 * ele: 监听元素；
 * onResize: resize回调（entry: 尺寸变化元素，isFirst: 是否为初次监听时的回调);
 */
export function useIntersectionObserver() {
  return {
    /**
     * 监听实例
     */
    observer: instance,
    /**
     * 创建监听实例
     * ele: 监听元素
     * listener: resize回调, 移除监听时需要指定该监听函数
     * isFirst: 是否为初次监听时的回调
     */
    observe: (el?: HTMLElement, listener?: IntersectionListenerT) => {
      if (!el || !isFunction(listener)) {
        return null;
      }

      // 同一元素，只创建一次ResizeObserver，通过数组存储回调
      const val = observerPool.get(el);
      if (val) {
        val.callbacks.push(listener);
      } else {
        instance.observe(el);

        observerPool.set(el, {
          element: el,
          callbacks: [listener],
        });
      }

      return instance;
    },
    /**
     * 移除监听
     * listener: 要移除的监听函数，如果不传，则使用初始化时的回调
     */
    unobserve: (el?: HTMLElement, listener?: IntersectionListenerT) => {
      if (!el || !isFunction(listener)) {
        return;
      }

      const val = observerPool.get(el);

      if (val) {
        const idx = val.callbacks.indexOf(listener);
        val.callbacks.splice(idx, 1);
        if (val.callbacks.length === 0) {
          // 当el无监听时，销毁resizeObserver
          instance.unobserve(el);
          observerPool.delete(el);
        }
      }
    },
  };
}
