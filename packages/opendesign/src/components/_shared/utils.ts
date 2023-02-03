import { throttle as _throttle, debounce as _debounce } from 'lodash-es';
import type { ThrottleSettings, DebounceSettings } from 'lodash-es';

// 防抖
export function debounce<T extends (...args: Array<unknown>) => unknown>(fn: T, wait?: number, ctx?: unknown | null, opts?: ThrottleSettings) {
  return _debounce.apply(ctx, [fn, wait, opts]);
}
// 节流
export function throttle<T extends (...args: Array<unknown>) => unknown>(fn: T, wait?: number, ctx?: unknown | null, opts?: DebounceSettings) {
  return _throttle.apply(ctx, [fn, wait, opts]);
}
// 防抖 时间为一个一帧
export function debounceRAF<T extends (...args: Array<unknown>) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<unknown>) => {
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
export function throttleRAF<T extends (...args: Array<unknown>) => unknown>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<unknown>) => {
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
