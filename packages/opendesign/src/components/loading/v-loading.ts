import { ObjectDirective, DirectiveBinding, createVNode, render } from 'vue';
import OLoading from './OLoading.vue';

import { LoadingPropsT } from './types';

let vLoadingOption = {};

const setVLoadingOption = (option: Partial<LoadingPropsT>) => {
  vLoadingOption = option;
};

const vLoading: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const vnode = createVNode(
      OLoading,
      Object.assign(vLoadingOption, {
        visible: binding.value,
        wrapper: binding.modifiers.body ? 'body' : null,
        mask: !binding.modifiers.nomask,
      })
    );

    if (binding.modifiers.body) {
      render(vnode, document.body);
    } else {
      render(vnode, el);
    }

    const vm = vnode.component;
    (el as any).__loading_data = {
      instance: vm,
    };
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue) {
      const data = (el as any).__loading_data;

      if (data) {
        data.instance.exposed.toggle(!!binding.value);
      }
    }
  },
};

export { vLoading, setVLoadingOption };
