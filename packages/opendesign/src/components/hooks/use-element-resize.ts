import { ObjectDirective } from 'vue';
import { useResizeObserver } from './use-resize-observer';
import type { ResizeListenerT } from './use-resize-observer';
import { isFunction } from '../_shared/utils';

const ob = useResizeObserver();
export function useReiszeObserverDirective(onResize: ResizeListenerT): { vResizeObserver: ObjectDirective } {
  return {
    vResizeObserver: {
      mounted(el: HTMLElement) {
        if (isFunction(onResize)) {
          ob.addListener(el, onResize);
        }
      },
      unmounted(el: HTMLElement) {
        if (onResize) {
          ob.removeListener(el, onResize);
        }
      },
    }
  };
}