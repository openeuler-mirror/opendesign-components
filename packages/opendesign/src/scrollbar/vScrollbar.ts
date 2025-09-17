import { ObjectDirective } from 'vue';
import { useScrollbar } from './use-scrollebar';
import { BaseScrollerPropsT } from './types';

const scrollbarMap = new WeakMap();

const vScrollbar: ObjectDirective<HTMLElement, false | Partial<BaseScrollerPropsT> | undefined> = {
  mounted(el: HTMLElement, binding) {
    const value = binding.value;

    if (value === false) {
      return;
    }

    const { unmount } = useScrollbar({
      target: el,
      ...value,
    });

    scrollbarMap.set(el, unmount);
  },
  unmounted(el: HTMLElement) {
    const unmount = scrollbarMap.get(el);
    if (unmount) {
      unmount();
    }
  },
};

export { vScrollbar };
