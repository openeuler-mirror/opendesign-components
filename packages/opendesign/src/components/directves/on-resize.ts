import { DirectiveBinding, ObjectDirective } from 'vue';
import { useResizeObserver } from '../hooks';
import { isFunction } from '../_shared/utils';

const ob = useResizeObserver();
let onResizeFn: (entry: ResizeObserverEntry) => void = () => null;

const vOnResize: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      onResizeFn = binding.value;
      ob.addListener(el, onResizeFn);
    }
  },
  unmounted(el: HTMLElement) {
    if (onResizeFn) {
      ob.removeListener(el, onResizeFn);
    }
  },
};

export {
  vOnResize
};