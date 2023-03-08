import { DirectiveBinding, ObjectDirective } from 'vue';
import { useResizeObserver, ResizeListenerT } from '../hooks';
import { isFunction } from '../_shared/is';

let listener: ResizeListenerT = () => null;
let ro: ReturnType<typeof useResizeObserver> | null = null;

const vOnResize: ObjectDirective = {
  beforeMount() {
    ro = useResizeObserver();
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      ro?.addResizeListener(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      ro?.removeResizeListener(el, listener);
    }
  },
};

export {
  vOnResize
};