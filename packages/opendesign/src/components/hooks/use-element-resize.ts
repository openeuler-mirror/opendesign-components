import { ObjectDirective } from 'vue';
import { useResizeObserver } from './use-resize-observer';
import type { ResizeListenerT } from './use-resize-observer';
import { isFunction } from '../_shared/is';

let ro: ReturnType<typeof useResizeObserver> | null = null;
export function useReiszeObserverDirective(onResize: ResizeListenerT): { vResizeObserver: ObjectDirective } {
  return {
    vResizeObserver: {
      beforeMount() {
        ro = useResizeObserver();
      },
      mounted(el: HTMLElement) {
        if (isFunction(onResize)) {
          ro?.addResizeListener(el, onResize);
        }
      },
      unmounted(el: HTMLElement) {
        if (onResize) {
          ro?.removeResizeListener(el, onResize);
        }
      },
    }
  };
}