import { createVNode, render, isRef, Ref, watch, ComponentInternalInstance } from 'vue';
import OLoading from './OLoading.vue';
import { LoadingPropsT } from './types';

const initLoading = (opt?: LoadingPropsT, el?: HTMLElement) => {
  const vnode = createVNode(OLoading, Object.assign(opt || {}, { wrapper: el }));
  if (el) {
    render(vnode, el);
  }
  return vnode.component;
};

const useLoading = (opt?: LoadingPropsT, wrap: Ref<HTMLElement> | HTMLElement | string = 'body') => {
  let instance: ComponentInternalInstance | null = null;
  if (typeof wrap === 'string') {
    const el = document.querySelector(wrap);
    if (el) {
      instance = initLoading(opt, el as HTMLElement);
    }
  } else if ((wrap as HTMLElement).nodeType === 1) {
    instance = initLoading(opt, wrap as HTMLElement);
  } else if (isRef(wrap)) {
    watch(
      () => wrap.value,
      (el) => {
        instance = initLoading(opt, el);
      }
    );
  }
  return {
    toggle() {
      if (instance) {
        instance.exposed?.toggle();
      }
    },
  };
};

export default useLoading;
