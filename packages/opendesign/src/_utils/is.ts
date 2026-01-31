const opt = Object.prototype.toString;

export function isUndefined(val: unknown): val is undefined {
  return val === undefined;
}

export function isNull(val: unknown): val is null {
  return opt.call(val) === '[object Null]';
}

export function isNil(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val);
}

export function isBoolean(val: unknown): val is boolean {
  return opt.call(val) === '[object Boolean]';
}

export function isString(val: unknown): val is string {
  return opt.call(val) === '[object String]';
}

export function isNumber(val: unknown): val is number {
  return opt.call(val) === '[object Number]' && !Number.isNaN(val as number);
}

/**
 * 是否是可转换成纯数字的字符串
 */
export function isNumeric(val: any) {
  if (isNil(val)) {
    return false;
  }
  if (typeof val === 'number') {
    return true;
  }
  return /^-?\d+(?:\.\d+)?$/.test(val.toString());
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isArray(val: unknown): val is Array<any> {
  return Array.isArray(val);
}

export function isEmptyArray(val: unknown): val is Array<any> {
  return isArray(val) && val.length === 0;
}

export function isArrayEqual(arr1: Array<any>, arr2: Array<any>): boolean {
  if (!isArray(arr1) || !isArray(arr2)) {
    return false;
  }
  const len = arr1.length;
  if (len !== arr2.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (!arr2.includes(arr1[i])) {
      return false;
    }
  }

  return true;
}

export function isEmptyObject(val: unknown): val is object {
  return opt.call(val) === '[object object]' && Object.keys(val as object).length === 0;
}
/**
 * 判断日期是否合法
 * @param d
 */
export function isValidDate(val: Date): val is Date {
  return val instanceof Date && !Number.isNaN(val.valueOf());
}

// 是否是对象或者数组等（key:value 形式）
export function isObject<T extends Record<any, any> = Record<any, any>>(val: unknown): val is T {
  return val !== null && typeof val === 'object';
}

// 是否是纯对象
export function isPlainObject(val: unknown): val is object {
  return opt.call(val) === '[object Object]';
}

export const isPromise = <T>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

export const isClient = typeof window !== 'undefined';

export const isTouchDevice = isClient ? 'ontouchstart' in document.documentElement : false;

export const isHoverDevice = isClient ? window.matchMedia('(hover: hover)').matches : false;

export const isIosDevice = isClient ? /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) : false;

export function isWindow(val: unknown): val is Window {
  return val === window;
}

/**
 * 判断一个给定的路径是否是当前页面的内部链接
 * @param {string} link - 需要判断的路径（可以是相对路径、绝对路径或完整URL）
 * @returns {boolean} - 如果是外部链接返回true，否则返回false
 */
export function isCurrentPageLink(link: string): boolean {
  // 处理锚点或空路径，通常视为内部链接
  if (link.startsWith('#')) {
    return true;
  }

  try {
    // 使用URL对象解析目标路径（以当前页面为基准）
    const targetUrl = new URL(link, window.location.href);

    // 比较协议、主机名、端口和路径
    return targetUrl.origin + targetUrl.pathname === window.location.origin + window.location.pathname;
  } catch {
    // 如果URL解析失败（如不规范的路径），判定为外部链接
    return false;
  }
}
