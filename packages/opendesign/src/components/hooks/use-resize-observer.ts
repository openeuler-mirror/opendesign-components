import ResizeObserver from 'resize-observer-polyfill';
import { isFunction } from '../_shared/utils';

export function useResizeObserver() {
  let ro: ResizeObserver | null = null;

  // 创建监听实例
  const createResizeObserver = (el: HTMLElement, onResize: (en: ResizeObserverEntry) => void) => {
    if (!el) {
      return;
    }
    ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      if (isFunction(onResize)) {
        onResize(entries[0]);
      }
    });
    ro.observe(el);
  };

  // 销毁监听
  const destoryResizeObserver = () => {
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  };

  return {
    createResizeObserver,
    destoryResizeObserver
  };
};