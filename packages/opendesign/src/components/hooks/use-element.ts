import { ObjectDirective } from 'vue';

export type LifeCycleT = 'mounted' | 'updated' | 'unmounted'

export function useElementDirective(onElementChange: (el: HTMLElement | null, type: LifeCycleT) => void) {
  const directive: ObjectDirective = {
    mounted(el: HTMLElement) {
      onElementChange(el, 'mounted');
    },
    updated(el: HTMLElement) {
      onElementChange(el, 'updated');
    },
    unmounted() {
      onElementChange(null, 'unmounted');
    }
  };
  return {
    getElementDirective: directive
  };
}