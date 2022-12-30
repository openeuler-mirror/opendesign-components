import { throttle as _throttle, debounce as _debounce } from 'lodash-es';
import type { ThrottleSettings, DebounceSettings } from 'lodash-es';

export function isFunction(fn: any) {
  return typeof fn === 'function';
}
// 防抖
export function debounce<T extends (...args: any) => any>(fn: T, wait?: number, ctx?: any | null, opts?: ThrottleSettings) {
  return _debounce.apply(ctx, [fn, wait, opts]);
}
// 节流
export function throttle<T extends (...args: any) => any>(fn: T, wait?: number, ctx?: any | null, opts?: DebounceSettings) {
  return _throttle.apply(ctx, [fn, wait, opts]);
}
// 防抖 时间为一个一帧
export function debounceRAF<T extends (...args: any) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: any[]) => {
    if (handle) {
      cancelAnimationFrame(handle);
    }
    handle = requestAnimationFrame(() => {
      fn(...args);
      handle = 0;
    });
  };
  rlt.cancel = () => {
    cancelAnimationFrame(handle);
    handle = 0;
  };
  return rlt;
}
// 节流 时间为一个一帧
export function throttleRAF<T extends (...args: any) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: any[]) => {
    if (handle) {
      return;
    }
    handle = requestAnimationFrame(() => {
      fn(...args);
      handle = 0;
    });
  };
  rlt.cancel = () => {
    cancelAnimationFrame(handle);
    handle = 0;
  };
  return rlt;
}