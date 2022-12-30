import { DirectiveBinding, ObjectDirective } from 'vue';
import { useIntersectionObserver, IntersectionListenerT } from '../hooks';
import { isFunction } from '../_shared/utils';

const io = useIntersectionObserver();
let listener: IntersectionListenerT = () => null;

const vIntersection: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      io.addListener(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      io.removeListener(el, listener);
    }
  },
};

export {
  vIntersection
};