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
    (v, i) => arr.slice(i * size, i * size + size)
  );
}
