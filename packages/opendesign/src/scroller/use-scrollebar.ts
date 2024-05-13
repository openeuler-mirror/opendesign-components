import { resolveHtmlElement } from '../_utils/vue-utils';
import { Ref, ComponentPublicInstance, createApp } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { ScrollbarPropsT } from './types';

interface UseScrollbarOptions extends Partial<Omit<ScrollbarPropsT, 'target'>> {
  wrapper?: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
  target: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
}

export function useScrollbar(options: UseScrollbarOptions) {
  const { wrapper, target, ...rests } = options;

  // 渲染组件
  const app = createApp(OScrollbar, {
    ...rests,
    target,
  });

  const div = document.createElement('div');
  const instance = app.mount(div);

  const mount = (wrapper: HTMLElement | null) => {
    const wrapperEl = wrapper || document.body;
    wrapperEl?.appendChild(div.childNodes[0]);
    wrapperEl?.classList.add('o-scrollbar-wrapper');
  };

  if (wrapper) {
    resolveHtmlElement(wrapper).then((el) => {
      mount(el);
    });
  } else {
    resolveHtmlElement(target).then((el) => {
      mount(el?.parentNode as HTMLElement | null);
    });
  }

  return {
    scrollbar: instance,
  };
}
