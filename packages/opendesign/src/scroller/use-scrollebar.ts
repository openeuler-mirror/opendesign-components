import { resolveHtmlElement } from '../_utils/vue-utils';
import { h, render, Ref, ComponentPublicInstance } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { ScrollbarPropsT } from './types';

interface UseScrollbarOptions extends Partial<Omit<ScrollbarPropsT, 'target'>> {
  wrapper?: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
  target: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
}

export async function useScrollbar(options: UseScrollbarOptions) {
  const { wrapper, target, ...rests } = options;

  const targetEl = await resolveHtmlElement(target);
  if (!targetEl) {
    return;
  }

  let wrapperEl: HTMLElement | null;
  if (wrapper) {
    wrapperEl = await resolveHtmlElement(wrapper);
  } else {
    wrapperEl = targetEl?.parentNode as HTMLElement;
  }

  if (!wrapperEl) {
    wrapperEl = document.body;
  }

  const vnode = h(OScrollbar, {
    ...rests,
    target: targetEl,
  });

  render(vnode, wrapperEl);

  wrapperEl.classList.add('o-scrollbar-wrapper');
}
