const opt = Object.prototype.toString;

export function isUndefined(val: unknown): val is undefined {
  return val === undefined;
}

export function isNull(val: unknown): val is null {
  return opt.call(val) === '[object Null]';
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

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isArray(val: unknown): val is Array<any> {
  return Array.isArray(val);
}
/**
 * 判断日期是否合法
 * @param d
 */
export function isValidDate(val: Date): val is Date {
  return val instanceof Date && !Number.isNaN(val.valueOf());
}

// 是否是对象或者数组等（key:value 形式）
export function isObject(val: unknown): val is Record<any, any> {
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
