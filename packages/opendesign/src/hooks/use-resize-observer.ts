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

// 记录监听数量
let record = 0;

// 创建监听实例
let instance: ResizeObserver | null = null;

function createObserver() {
  return new ResizeObserver((entries: ResizeObserverEntry[]) => {
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
}
export type ResizeListenerT = (entry: ResizeObserverEntry, isFirst: boolean) => void;
/**
 * 监听元素尺寸变化，
 * ele: 监听元素；
 * onResize: resize回调（entry: 尺寸变化元素，isFirst: 是否为初次监听时的回调);
 */
export function useResizeObserver() {
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
    observe: (el?: HTMLElement, listener?: ResizeListenerT) => {
      if (!el || !isFunction(listener)) {
        return null;
      }

      // 同一元素，只创建一次ResizeObserver，通过数组存储回调
      const val = observerPool.get(el);
      if (val) {
        val.callbacks.push(listener);
      } else {
        if (!instance) {
          instance = createObserver();
        }
        instance.observe(el);
        record++;

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
     * listener: 要移除的监听函数，如果不传，则使用初始化时的onResize回调
     */
    unobserve: (el?: HTMLElement, listener?: ResizeListenerT) => {
      if (!el || !isFunction(listener) || !instance) {
        return;
      }

      const val = observerPool.get(el);

      if (val) {
        const idx = val.callbacks.indexOf(listener);
        val.callbacks.splice(idx, 1);

        // 当el无监听时，销毁resizeObserver
        if (val.callbacks.length === 0) {
          instance.unobserve(el);
          observerPool.delete(el);

          // 无监听元素，就断开
          record--;
          if (record === 0) {
            instance.disconnect();
            instance = null;
          }
        }
      }
    },
  };
}
