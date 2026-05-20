import { useCssVar, useEventListener, useDebounceFn, type MaybeElementRef, type UseCssVarOptions } from '@vueuse/core'
import { type ComputedRef, type MaybeRefOrGetter, type Ref, computed, toValue } from "vue";

import {getCssVariable} from "../_utils/dom.ts";

/**
 * 响应式 CSS 变量钩子配置项
 */
export interface UseResponseCssVarOptions<T = string> extends UseCssVarOptions {
  /** 防抖延迟（毫秒），默认 100ms */
  debounce?: number
  /** 对 CSS 变量值进行转换处理 */
  transform?: (value: string) => T
}

/**
 * 响应式 CSS 变量钩子
 * 在 useCssVar 基础上监听窗口宽度变化，解决媒体查询触发的 CSS 变量更新不响应问题
 */
export function useResponseCssVar(prop: MaybeRefOrGetter<string>, target?: MaybeElementRef, options?: UseResponseCssVarOptions): Ref<string>
export function useResponseCssVar<T>(prop: MaybeRefOrGetter<string>, target?: MaybeElementRef, options?: UseResponseCssVarOptions<T>): ComputedRef<T>
export function useResponseCssVar<T = string>(prop: MaybeRefOrGetter<string>, target?: MaybeElementRef, options?: UseResponseCssVarOptions<T>): Ref<string> | ComputedRef<T> {
  const { debounce = 100, transform, ...cssVarOptions } = options ?? {}
  const cssVar = useCssVar(prop, target, cssVarOptions)

  useEventListener('resize', useDebounceFn(() => {
    const el = toValue(target as MaybeRefOrGetter<HTMLElement | null | undefined>) ?? document.documentElement
    cssVar.value = getCssVariable(toValue(prop), el)
  }, debounce))

  if (transform) {
    return computed(() => transform(cssVar.value))
  }

  return cssVar
}
