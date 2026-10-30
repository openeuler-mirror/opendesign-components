import { useEventListener, useDebounceFn, type MaybeElementRef } from '@vueuse/core';
import { type ComputedRef, type MaybeRefOrGetter, type Ref, computed, ref, toValue, watch } from 'vue';

import { getCssVariable } from '../_utils/dom.ts';

/**
 * 响应式 CSS 变量钩子配置项
 */
export interface UseResponseCssVarOptions<T = string> {
  /** 初始回退值：SSR / 目标元素未挂载 / 变量未定义导致读取为空时使用 */
  initialValue?: string;
  /** 防抖延迟（毫秒），默认 100ms */
  debounce?: number;
  /** 对 CSS 变量值进行转换处理 */
  transform?: (value: string) => T;
}

/**
 * 响应式 CSS 变量钩子（只读）
 *
 * 读取目标元素上 CSS 变量的 computed 值，并监听窗口 resize 防抖重读，
 * 用于感知媒体查询（断点切换）引起的变量值变化——媒体查询变化不触发
 * 元素 style/class 变更，必须显式监听 resize。
 *
 * 只读语义：全程不向目标元素写回内联 CSS 变量。内联值的级联优先级高于
 * 媒体查询规则，一旦写回，视口离开断点后变量会被"钉死"在断点值且无法自愈。
 *
 * 读取时机：
 *   1. 目标元素挂载 / prop 变化时初始读取（flush: 'post' 确保元素已进入 DOM）；
 *   2. 窗口 resize 防抖后重读。
 */
export function useResponseCssVar(prop: MaybeRefOrGetter<string>, target?: MaybeElementRef, options?: UseResponseCssVarOptions): Ref<string>;
export function useResponseCssVar<T>(prop: MaybeRefOrGetter<string>, target?: MaybeElementRef, options?: UseResponseCssVarOptions<T>): ComputedRef<T>;
export function useResponseCssVar<T = string>(
  prop: MaybeRefOrGetter<string>,
  target?: MaybeElementRef,
  options?: UseResponseCssVarOptions<T>,
): Ref<string> | ComputedRef<T> {
  const { debounce = 100, transform, initialValue = '' } = options ?? {};
  const raw = ref(initialValue);

  /**
   * 从目标元素读取 computed 值（无 window 的 SSR 环境下跳过，保持 initialValue 回退）。
   * 读取结果为空（变量未定义）时同样回退 initialValue。
   */
  const read = () => {
    if (typeof window === 'undefined') {
      return;
    }
    const el = toValue(target as MaybeRefOrGetter<HTMLElement | null | undefined>) ?? document.documentElement;
    raw.value = getCssVariable(toValue(prop), el).trim() || initialValue;
  };

  watch(() => [toValue(target), toValue(prop)] as const, read, { immediate: true, flush: 'post' });

  useEventListener('resize', useDebounceFn(read, debounce));

  if (transform) {
    return computed(() => transform(raw.value));
  }

  return raw;
}
