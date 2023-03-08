import { ObjectDirective } from 'vue';
import { useIntersectionObserver } from './use-intersection-observer';
import type { IntersectionListenerT } from './use-intersection-observer';
import { isFunction } from '../_shared/is';

let io: ReturnType<typeof useIntersectionObserver> | null = null;
export function useIntersectionObserverDirective({ listener, removeOnUnmounted }: {
  listener: IntersectionListenerT,
  removeOnUnmounted?: boolean
}): { vIntersectionObserver: ObjectDirective } {
  return {
    vIntersectionObserver: {
      beforeMount() {
        io = useIntersectionObserver();
      },
      mounted(el: HTMLElement) {
        if (isFunction(listener)) {
          io?.addIntersectionListener(el, listener);
        }
      },
      unmounted(el: HTMLElement) {
        if (listener && removeOnUnmounted) {
          io?.removeIntersectionListener(el, listener);
        }
      },
    }
  };
}