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

/**
 * 颜色池
 */
class ColorPool {
  pool: Array<string>;
  tmpPool: Array<string>;

  constructor(pool: Array<string>) {
    this.pool = pool;
    this.tmpPool = [...pool];
  }
  /**
   * 返回指定位置颜色，或者从颜色池随机返回一个颜色
   * @param index
   * @returns
   */
  pick(index?: number): string {
    if (index !== undefined) {
      return this.pool[index % this.pool.length];
    }
    const { length } = this.tmpPool;
    if (length === 0) {
      this.tmpPool = [...this.pool];
    }
    const idx = Math.floor(Math.random() * length);
    const color = this.tmpPool[idx];
    this.tmpPool.splice(idx, 1);

    return color;
  }
}

const PrestColor = ['#d9e6c3', '#ebd5be', '#d1e6de', '#e0ceeb', '#ebd3c7', '#e6dada', '#e3deeb', '#dedae6', '#cad0e8', '#cedeeb'];
export const PrestColorPool = new ColorPool(PrestColor);