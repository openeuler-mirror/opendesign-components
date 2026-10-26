import { resolveHtmlElement } from '../_utils/vue-utils';
import { isClient } from '../_utils/is';
import { type Ref, type ComponentPublicInstance, createApp } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { ScrollbarPropsT } from './types';

interface UseScrollbarOptions extends Partial<Omit<ScrollbarPropsT, 'target'>> {
  wrapper?: Ref<string | ComponentPublicInstance | HTMLElement | null | undefined> | HTMLElement | string;
  target: Ref<string | ComponentPublicInstance | HTMLElement | null | undefined> | HTMLElement | string;
}

const ScrollbarClass = {
  wrapper: 'o-scrollbar-wrapper',
};

/**
 * 创建并挂载滚动条实例
 * @description 在 SSR 环境下安全跳过，仅在浏览器环境执行 DOM 操作
 * @param options 滚动条配置
 * @returns 滚动条实例与卸载方法
 */
export function useScrollbar(options: UseScrollbarOptions) {
  if (!isClient) {
    return { scrollbar: null, unmount: () => {} };
  }

  const { wrapper, target, ...rests } = options;

  // 渲染组件
  const app = createApp(OScrollbar, {
    ...rests,
    target,
  });

  const div = document.createElement('div');
  const instance = app.mount(div) as InstanceType<typeof OScrollbar>;

  let wrapperEl: HTMLElement;

  const mount = (wrap: HTMLElement | null) => {
    // resolveHtmlElement 异步获取到 el 时，OScrollbar 可能已被卸载
    if (div.childNodes.length === 0) {
      return;
    }
    wrapperEl = wrap || document.body;
    wrapperEl?.appendChild(div.childNodes[0]);
    wrapperEl?.classList.add(ScrollbarClass.wrapper);
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
    unmount: () => {
      app.unmount();
      wrapperEl?.classList.remove(ScrollbarClass.wrapper);
    },
  };
}
