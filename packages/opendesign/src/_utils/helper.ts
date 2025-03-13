import { isObject, isUndefined, isNull, isPlainObject } from './is';
// 防抖 时间为一个一帧
export function debounceRAF<T extends (...args: Array<any>) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<any>) => {
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
export function throttleRAF<T extends (...args: Array<any>) => any>(fn: T) {
  let handle = 0;
  const rlt = (...args: Array<any>) => {
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
    (_v, i) => arr.slice(i * size, i * size + size)
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
    } catch (error) {
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
export function pick(source: Object, keys: string[]) {
  const result: Record<string, any> = {};
  keys.forEach((key) => {
    if (key in source) {
      result[key] = source[key as keyof typeof source];
    }
  });
  return result;
}
