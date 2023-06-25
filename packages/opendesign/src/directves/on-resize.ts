import { DirectiveBinding, ObjectDirective } from 'vue';
import { useResizeObserver, ResizeListenerT } from '../hooks';
import { isFunction } from '../_utils/is';

let listener: ResizeListenerT = () => null;
let ro: ReturnType<typeof useResizeObserver> | null = null;

const vOnResize: ObjectDirective = {
  beforeMount() {
    ro = useResizeObserver();
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      ro?.observe(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      ro?.unobserve(el, listener);
    }
  },
};

export { vOnResize };
