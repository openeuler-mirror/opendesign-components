import { resolveHtmlElement } from '../_utils/vue-utils';
import { h, render, Ref, ComponentPublicInstance } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { ScrollbarPropsT } from './types';

interface UseScrollbarOptions extends Partial<ScrollbarPropsT> {
  wrapper?: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
}

export async function useScrollbar(options: UseScrollbarOptions) {
  if (!options.target) {
    return;
  }
  const { wrapper, ...rests } = options;

  let wrapperEl: HTMLElement | null;
  if (wrapper) {
    wrapperEl = await resolveHtmlElement(wrapper);
  } else {
    const targetEl = await resolveHtmlElement(options.target);
    wrapperEl = targetEl?.parentNode as HTMLElement;
  }

  if (!wrapperEl) {
    wrapperEl = document.body;
  }

  const vnode = h(OScrollbar, {
    ...rests,
  });

  render(vnode, wrapperEl);

  wrapperEl.classList.add('o-scrollbar-wrapper');
}
