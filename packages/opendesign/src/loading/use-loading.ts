import { h, render, isRef, Ref, watch, ComponentInternalInstance, onMounted } from 'vue';
import OLoading from './OLoading.vue';
import { LoadingPropsT } from './types';

const initLoading = (opt?: Partial<LoadingPropsT>, el?: HTMLElement) => {
  const vnode = h(OLoading, Object.assign(opt || {}, { wrapper: el }));
  if (el) {
    render(vnode, el);
  }
  return vnode.component;
};

const useLoading = (opt?: Partial<LoadingPropsT>, wrap: Ref<HTMLElement> | HTMLElement | string = 'body') => {
  let instance: ComponentInternalInstance | null = null;
  if (isRef(wrap)) {
    watch(
      () => wrap.value,
      (el) => {
        instance = initLoading(opt, el);
      },
      {
        immediate: true,
      }
    );
  } else if ((wrap as HTMLElement).nodeType === 1) {
    instance = initLoading(opt, wrap as HTMLElement);
  } else if (typeof wrap === 'string') {
    onMounted(() => {
      const el = document.querySelector(wrap);
      if (el) {
        instance = initLoading(opt, el as HTMLElement);
      }
    });
  }

  return {
    toggle(show?: boolean) {
      instance?.exposed?.toggle(show);
    },
  };
};

export default useLoading;
