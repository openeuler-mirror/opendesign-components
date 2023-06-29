import { ObjectDirective, DirectiveBinding } from 'vue';
import { useOutClick } from '../hooks/use-out-click';

let out: ReturnType<typeof useOutClick> | null = null;
const vOutClick: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    out = useOutClick();
    out?.addListener(el, binding.value, {
      fast: binding.modifiers.fast,
    });
  },
  unmounted(el: HTMLElement) {
    out?.removeListener(el);
  },
};

export { vOutClick };
