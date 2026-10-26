import { DirectiveBinding, ObjectDirective } from 'vue';
import { useResizeObserver, ResizeListenerT } from '../hooks';
import { isFunction } from '../_utils/is';

let ro: ReturnType<typeof useResizeObserver> | null = null;

const listenerMap = new WeakMap<HTMLElement, ResizeListenerT>();

const vOnResize: ObjectDirective = {
  beforeMount() {
    ro = useResizeObserver();
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listenerMap.set(el, binding.value);
      ro?.observe(el, binding.value);
    }
  },
  unmounted(el: HTMLElement) {
    const listener = listenerMap.get(el);
    if (listener) {
      ro?.unobserve(el, listener);
      listenerMap.delete(el);
    }
  },
};

export { vOnResize };
