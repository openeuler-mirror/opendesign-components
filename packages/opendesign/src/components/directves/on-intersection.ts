import { DirectiveBinding, ObjectDirective } from 'vue';
import { useIntersectionObserver, IntersectionListenerT } from '../hooks';
import { isFunction } from '../_shared/is';

let io: ReturnType<typeof useIntersectionObserver> | null = null;
let listener: IntersectionListenerT = () => null;

const vIntersection: ObjectDirective = {
  beforeMount() {
    io = useIntersectionObserver();
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      io?.addIntersectionListener(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      io?.removeIntersectionListener(el, listener);
    }
  },
};

export {
  vIntersection
};