import { ObjectDirective, DirectiveBinding } from 'vue';
import { useOutClick } from '../hooks/use-out-click';

const { addListener, removeListener } = useOutClick();

const vOutClick: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    addListener(el, binding.value);
  },
  unmounted(el: HTMLElement) {
    removeListener(el);
  }
};

export {
  vOutClick
};