import { isObject, isUndefined, isNull, isPlainObject, isClient } from './is';
import { Log } from './log.ts';

const log = new Log('helper');

/**
 * 创建一个防抖函数，延迟执行目标函数，直到停止调用一段时间后。
 *
 * @template T - 被包装函数的类型
 * @param {T} fn - 需要防抖处理的目标函数
 * @param {number} [wait=0] - 延迟等待的时间（毫秒）
 * @param {boolean} [leading=true] - 是否在首次调用时立即执行一次函数
 * @param {boolean} [trailing=false] - 当 `leading` 为 `true` 时，是否允许在**等待期间发生过后续调用**的情况下，于延迟结束后再次执行一次函数
 * @returns {T} - 返回新的防抖函数
 *
 * @example
 * // 默认行为：首次调用立即执行，后续调用重置计时器，停止调用后不再执行
 * const debouncedFn = debounce(fn, 500);
 *
 * @example
 * // 仅延迟执行：等待 500ms 无新调用后才执行一次
 * const debouncedFn = debounce(fn, 500, false);
 *
 * @example
 * // 立即执行 + 尾部执行：首次立即执行，若在 500ms 内又调用了，则停止调用 500ms 后再执行一次
 * const debouncedFn = debounce(fn, 500, true, true);
 *
 * @remarks
 * - 当 `leading` 和 `trailing` 均为 `true` 时，函数在连续快速调用中最多执行两次：开始一次，结束一次。
 * - 如果在等待期间只调用了一次（即没有后续调用重置计时器），则不会触发 `trailing` 执行。
 */
export function debounce<T extends (...args: Array<any>) => any>(fn: T, wait?: number, leading?: false): T;
export function debounce<T extends (...args: Array<any>) => any>(fn: T, wait: number, leading: true, trailing?: boolean): T;
export function debounce<T extends (...args: Array<any>) => any>(fn: T, wait: number = 0, leading: boolean = true, trailing = false) {
  let handler = 0;
  let hasTrailingCall = false;
  return (...args: Array<any>) => {
    if (!isClient) {
      log.error('[debounce] 此函数应仅在客户端环境使用。');
    }
    if (leading) {
      if (handler === 0) {
        fn(...args);
      } else {
        hasTrailingCall = true;
      }
    }
    clearTimeout(handler);
    handler = window.setTimeout(() => {
      if (!leading || (hasTrailingCall && trailing)) {
        fn(...args);
      }
      handler = 0;
      hasTrailingCall = false;
    }, wait);
  };
}

/**
 * @description 基于 requestAnimationFrame 的防抖，仅在客户端环境下有意义。
 * 调用方应确保仅在客户端激活后使用此函数。
 *
 * @template T - 被包装函数的类型
 * @param {T} fn - 需要防抖处理的目标函数
 * @returns {T & { cancel: () => void }} 返回防抖函数，附带 cancel 方法用于取消待执行帧
 */
export function debounceRAF<T extends (...args: Array<any>) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<any>) => {
    if (!isClient) {
      log.error('[debounceRAF] 此函数依赖 requestAnimationFrame，仅可在客户端环境使用。');
    }
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
/**
 * @description 基于 requestAnimationFrame 的节流，仅在客户端环境下有意义。
 * 调用方应确保仅在客户端激活后使用此函数。
 *
 * @template T - 被包装函数的类型
 * @param {T} fn - 需要节流处理的目标函数
 * @returns {T & { cancel: () => void }} 返回节流函数，附带 cancel 方法用于取消待执行帧
 */
export function throttleRAF<T extends (...args: Array<any>) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<any>) => {
    if (handle) {
      return;
    }
    if (!isClient) {
      log.error('[throttleRAF] 此函数依赖 requestAnimationFrame，仅可在客户端环境使用。');
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
export class ColorPool {
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
/**
 * 生成随机字符串
 * @param prefix 前缀
 * @param length 字符串长度
 */
export function uniqueId(prefix: string = '', length: number = 8): string {
  const gen = (len: number): string => {
    if (len <= 11) {
      return Math.random()
        .toString(36)
        .slice(2, 2 + len)
        .padEnd(len, '0');
    } else {
      return gen(11) + gen(len - 11);
    }
  };
  return prefix ? `${prefix}-${gen(length)}` : gen(length);
}

/**
 * 将数组拆分成多个指定长度的区块
 * @param arr 被拆分数组
 * @param size 区块长度
 */
export function chunk(arr: any[] = [], size = 1) {
  return Array.from(
    {
      length: Math.ceil(arr.length / size),
    },
    (_v, i) => arr.slice(i * size, i * size + size),
  );
}

/**
 * 异步some
 * @param array 遍历数组
 * @param judgeFn 判断函数
 */
export async function asyncSome<T>(array: Array<T>, judgeFn: (arrayItem: T) => Promise<boolean | undefined>) {
  for (const iterator of array) {
    try {
      if (await judgeFn(iterator)) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * 根据path从对象中获取值
 */
export function getValueByPath(obj: object, path: string) {
  if (!obj || !path) {
    return;
  }

  const keys = path.split('.');
  if (keys.length === 0) {
    return;
  }

  let temp: any = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!isObject(temp)) {
      return;
    }
    temp = temp[keys[i] as keyof typeof temp];
    if (i === keys.length - 1) {
      return temp;
    }
  }
}

/**
 * 根据path设置对象中的值
 */
export function setValueByPath(obj: { [k: string]: any }, path: string, value: any) {
  if (!obj || !path) {
    return;
  }

  const keys = path.split('.');
  if (keys.length === 0) {
    return;
  }

  let temp = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!isObject(temp)) {
      throw new TypeError(`Cannot set properties of non-object (setting '${keys[i]}')!`);
    }
    const k = keys[i] as keyof typeof temp;
    if (i === keys.length - 1) {
      temp[k] = value;
    } else {
      if (isUndefined(temp[k])) {
        temp[k] = Number(keys[i + 1]) ? [] : {};
      }
      temp = temp[k];
    }
  }
}

/**
 * 将数组中的某一项移到第一项
 * @param arr 被移动的数组
 * @param item 需要移动的项
 * @returns Array
 */
export function moveToFirst<T>(arr: T[], item: T) {
  const idx = arr.indexOf(item);
  if (idx > 0) {
    const tmp = [...arr];
    tmp.splice(idx, 1);
    tmp.unshift(item);
    return tmp;
  }
  return arr;
}

/**
 * 转换为字符串，对于undefined、null、NaN转换为''
 * @param val
 * @returns string
 */
export function formateToString(val: unknown): string {
  if (isUndefined(val) || isNull(val) || (typeof val === 'number' && isNaN(val as number)) || isPlainObject(val)) {
    return '';
  }
  return String(val);
}

/**
 * 使用图片url请求加载图片
 * @param src s
 * @returns
 */
export function requestImage(src: string) {
  return new Promise((resolve, reject) => {
    const onImgLoaded = () => {
      resolve(src);
    };
    const onImgError = (e: Event | string) => {
      reject(e);
    };
    const img = new Image();
    img.onload = onImgLoaded;
    img.onerror = onImgError;
    img.src = src;
  });
}

/**
 * 从对象中挑选属性
 */
export function pick(source: object, keys: string[]) {
  const result: Record<string, any> = {};
  keys.forEach((key) => {
    if (key in source) {
      result[key] = source[key as keyof typeof source];
    }
  });
  return result;
}

/**
 * 分批执行大量任务
 * tasks: 任务列表 Array<() => void>
 * sheduler：调度器函数，用于分批执行任务
 *    runChunk：分批执行函数 (toContinue:(currentTaskIndex: number)=>boolean)=>void
 *        toContinue:(currentTaskIndex: number)=>boolean 是否继续执行的条件
 */
export function performTask(tasks: Array<() => void>, sheduler: (runChunk: (toContinue: (currentTaskIndex: number) => boolean) => void) => void) {
  let runingIndex = 0;
  function _runTask() {
    sheduler((toContinue) => {
      while (runingIndex < tasks.length && toContinue(runingIndex)) {
        tasks[runingIndex++]();
      }
      if (runingIndex < tasks.length) {
        _runTask();
      }
    });
  }
  _runTask();
}

/**
 * 分时执行大量任务,使用requestIdleCallback
 * tasks: 任务列表 Array<() => void>
 */
export function idlePerformTask(tasks: Array<() => void>) {
  const sheduler = (runChunk: (toContinue: () => boolean) => void) => {
    requestIdleCallback((idle) => {
      runChunk(() => idle.timeRemaining() > 0);
    });
  };

  performTask(tasks, sheduler);
}

/**
 * polyfill to Promise.withResolvers (ES2024)
 */
export function promiseWithResolvers<T = unknown>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
} {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}
