import { isFunction } from '../_utils/is';

type ElementPool = WeakMap<
  HTMLElement,
  {
    element: HTMLElement;
    callbacks: Array<(entry: IntersectionObserverEntry, isIntersecting: boolean) => void>;
  } | null
>;
interface ObserveInstance {
  observer: IntersectionObserver;
  record: number;
  elementPool: ElementPool;
}
const defaultKey = {};
/**
 * 实例池
 */
const instancePool = new WeakMap<IntersectionObserverInit | typeof defaultKey, ObserveInstance>();

function createObserverInstance(options?: IntersectionObserverInit): ObserveInstance {
  let instance = instancePool.get(options || defaultKey);
  if (!instance) {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const ele = entry.target as HTMLElement;
        const ins = instance?.elementPool.get(ele);

        if (!ins) {
          return;
        }

        ins?.callbacks?.forEach((fn) => fn(entry, entry.isIntersecting));
      });
    }, options);

    /**
     * 监听元素池
     */
    const elementPool: ElementPool = new WeakMap();
    instance = {
      observer,
      record: 0,
      elementPool: elementPool,
    };
    instancePool.set(options || defaultKey, instance);
  }
  return instance;
}

/**
 * 监听元素进入视口；
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  // 创建监听实例
  const instance = createObserverInstance(options);

  return {
    /**
     * 监听实例
     */
    observer: instance.observer,
    /**
     * 创建监听实例
     * el: 添加监听的元素
     * listener: 进入视口回调, 移除监听时需要指定该监听函数
     */
    observe: (el: HTMLElement, listener: (entry: IntersectionObserverEntry) => void) => {
      if (!el || !isFunction(listener)) {
        return null;
      }

      // 同一元素，只创建一次Observer，通过数组存储回调
      const val = instance.elementPool.get(el);
      if (val) {
        val.callbacks.push(listener);
      } else {
        instance.observer.observe(el);
        instance.record++;

        instance.elementPool.set(el, {
          element: el,
          callbacks: [listener],
        });
      }

      return instance.observer;
    },
    /**
     * 移除对某元素的监听
     * el: 要移除监听的元素
     * listener: 要移除的监听函数，如果不传，则使用初始化时的回调
     */
    unobserve: (el: HTMLElement, listener: (entry: IntersectionObserverEntry) => void) => {
      if (!el || !isFunction(listener) || !instance) {
        return;
      }

      const val = instance.elementPool.get(el);

      if (val) {
        const idx = val.callbacks.indexOf(listener);
        val.callbacks.splice(idx, 1);

        // 当el无监听回调时，不再监听该元素
        if (val.callbacks.length === 0) {
          instance.observer.unobserve(el);
          instance.elementPool.delete(el);
          instance.record--;

          // 当无需要监听的元素，就断开
          if (instance.record === 0) {
            instance.observer.disconnect();
          }
        }
      }
    },
    /**
     * 销毁观察器
     */
    destroy() {
      instance.observer.disconnect();
    },
  };
}
