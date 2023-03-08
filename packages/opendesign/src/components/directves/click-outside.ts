import { ObjectDirective, DirectiveBinding } from 'vue';
import { useOutClick } from '../hooks/use-out-click';


let out: ReturnType<typeof useOutClick> | null = null;
const vOutClick: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    out = useOutClick();
    out?.addOutClickListener(el, binding.value);
  },
  unmounted(el: HTMLElement) {
    out?.removeOutClickListener(el);
  }
};

export {
  vOutClick
};