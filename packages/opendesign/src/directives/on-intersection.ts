import { DirectiveBinding, ObjectDirective } from 'vue';
import { useIntersectionObserver } from '../hooks';
import { isFunction } from '../_utils/is';

let io: ReturnType<typeof useIntersectionObserver> | null = null;
let listener: (entry: IntersectionObserverEntry) => void = () => null;

const vIntersection: ObjectDirective = {
  beforeMount() {
    io = useIntersectionObserver();
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (isFunction(binding.value)) {
      listener = binding.value;
      io?.observe(el, listener);
    }
  },
  unmounted(el: HTMLElement) {
    if (listener) {
      io?.unobserve(el, listener);
    }
  },
};

export { vIntersection };
