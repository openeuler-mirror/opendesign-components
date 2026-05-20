import {type MaybeRef, type Ref, onMounted, onUnmounted, ref, toValue, watch} from 'vue';

import {isOverflown} from "../_utils/dom.ts";
import { useResizeObserver } from './use-resize-observer';


/* 动态监听一个元素自身是否触发文本溢出隐藏，元素尺寸变化时自动更新 */
export function useElementOverflown(elementRef: MaybeRef<HTMLElement | null | undefined>): Ref<boolean> {
  const result = ref(false);

  const check = () => {
    result.value = isOverflown(toValue(elementRef) ?? undefined);
  };

  onMounted(() => {
    const { observe, unobserve } = useResizeObserver();

    const el = toValue(elementRef);
    if (el) {
      check();
      observe(el, check);
    }

    const stopWatch = watch(
      () => toValue(elementRef),
      (_el, oldEl) => {
        if (oldEl) unobserve(oldEl, check);
        if (_el) {
          check();
          observe(_el, check);
        } else {
          result.value = false;
        }
      },
      { flush: 'post' },
    );

    onUnmounted(() => {
      stopWatch();
      const _el = toValue(elementRef);
      if (_el) unobserve(_el, check);
    });
  });

  return result;
}