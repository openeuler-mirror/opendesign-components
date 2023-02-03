import { DirectiveBinding, ObjectDirective } from 'vue';
import { useIntersectionObserver, IntersectionListenerT } from '../hooks';
import { isFunction } from '../_shared/is';

const io = useIntersectionObserver();
let listener: IntersectionListenerT = () => null;

const vIntersection: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      io.addIntersectionListener(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      io.removeIntersectionListener(el, listener);
    }
  },
};

export {
  vIntersection
};