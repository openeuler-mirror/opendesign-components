import { ObjectDirective, DirectiveBinding } from 'vue';
import { useOutClick } from '../hooks/use-out-click';

const { addOutClickListener, removeOutClickListener } = useOutClick();

const vOutClick: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    addOutClickListener(el, binding.value);
  },
  unmounted(el: HTMLElement) {
    removeOutClickListener(el);
  }
};

export {
  vOutClick
};