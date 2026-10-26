/**
 * _utils/is.ts 类型判断工具函数测试。
 *
 * 覆盖所有导出的类型守卫函数，验证各种输入下的正确判定。
 */
import { test, expect, describe } from 'vitest';
import {
  isUndefined,
  isNull,
  isNil,
  isBoolean,
  isString,
  isNumber,
  isNumeric,
  isFunction,
  isArray,
  isEmptyArray,
  isArrayEqual,
  isEmptyObject,
  isValidDate,
  isObject,
  isPlainObject,
  isPromise,
  isWindow,
  isCurrentPageLink,
} from './is';

describe('isUndefined', () => {
  test('isUndefined - undefined 返回 true', () => {
    expect(isUndefined(undefined)).toBe(true);
  });
  test('isUndefined - null 返回 false', () => {
    expect(isUndefined(null)).toBe(false);
  });
  test('isUndefined - 0 返回 false', () => {
    expect(isUndefined(0)).toBe(false);
  });
  test('isUndefined - 空字符串返回 false', () => {
    expect(isUndefined('')).toBe(false);
  });
});

describe('isNull', () => {
  test('isNull - null 返回 true', () => {
    expect(isNull(null)).toBe(true);
  });
  test('isNull - undefined 返回 false', () => {
    expect(isNull(undefined)).toBe(false);
  });
});

describe('isNil', () => {
  test('isNil - null 和 undefined 都返回 true', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });
  test('isNil - 其他值返回 false', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
  });
});

describe('isBoolean', () => {
  test('isBoolean - true / false 返回 true', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });
  test('isBoolean - 非布尔值返回 false', () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean(null)).toBe(false);
  });
});

describe('isString', () => {
  test('isString - 字符串返回 true', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
  });
  test('isString - 非字符串返回 false', () => {
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe('isNumber', () => {
  test('isNumber - 有效数字返回 true', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
  });
  test('isNumber - NaN 返回 false', () => {
    expect(isNumber(NaN)).toBe(false);
  });
  test('isNumber - 数字字符串返回 false', () => {
    expect(isNumber('123')).toBe(false);
  });
});

describe('isNumeric', () => {
  test('isNumeric - 数字返回 true', () => {
    expect(isNumeric(123)).toBe(true);
    expect(isNumeric(0)).toBe(true);
  });
  test('isNumeric - 数字字符串（含浮点）返回 true', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('3.14')).toBe(true);
    expect(isNumeric('-42')).toBe(true);
  });
  test('isNumeric - float=false 时不允许浮点', () => {
    expect(isNumeric('3.14', false)).toBe(false);
    expect(isNumeric('42', false)).toBe(true);
  });
  test('isNumeric - 非数字字符串返回 false', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('')).toBe(false);
  });
  test('isNumeric - null / undefined 返回 false', () => {
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
  });
});

describe('isFunction', () => {
  test('isFunction - 函数返回 true', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
    expect(isFunction(class Foo {})).toBe(true);
  });
  test('isFunction - 非函数返回 false', () => {
    expect(isFunction(123)).toBe(false);
    expect(isFunction('func')).toBe(false);
    expect(isFunction(null)).toBe(false);
  });
});

describe('isArray', () => {
  test('isArray - 数组返回 true', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
  });
  test('isArray - 非数组返回 false', () => {
    expect(isArray({})).toBe(false);
    expect(isArray('abc')).toBe(false);
    expect(isArray(null)).toBe(false);
  });
});

describe('isEmptyArray', () => {
  test('isEmptyArray - 空数组返回 true', () => {
    expect(isEmptyArray([])).toBe(true);
  });
  test('isEmptyArray - 非空数组返回 false', () => {
    expect(isEmptyArray([1])).toBe(false);
  });
  test('isEmptyArray - 非数组返回 false', () => {
    expect(isEmptyArray({})).toBe(false);
    expect(isEmptyArray(null)).toBe(false);
  });
});

describe('isArrayEqual', () => {
  test('isArrayEqual - 顺序不敏感时相同元素返回 true', () => {
    expect(isArrayEqual([1, 2, 3], [3, 2, 1])).toBe(true);
  });
  test('isArrayEqual - order=true 时顺序敏感', () => {
    expect(isArrayEqual([1, 2, 3], [3, 2, 1], true)).toBe(false);
    expect(isArrayEqual([1, 2, 3], [1, 2, 3], true)).toBe(true);
  });
  test('isArrayEqual - 长度不同返回 false', () => {
    expect(isArrayEqual([1, 2], [1, 2, 3])).toBe(false);
  });
  test('isArrayEqual - 非数组返回 false', () => {
    expect(isArrayEqual('ab', 'ab')).toBe(false);
  });
});

describe('isEmptyObject', () => {
  test('isEmptyObject - 空对象返回 true', () => {
    expect(isEmptyObject({})).toBe(true);
  });
  test('isEmptyObject - 非空对象返回 false', () => {
    expect(isEmptyObject({ a: 1 })).toBe(false);
  });
  test('isEmptyObject - 非对象返回 false', () => {
    expect(isEmptyObject(null)).toBe(false);
    expect(isEmptyObject([])).toBe(false);
  });
});

describe('isValidDate', () => {
  test('isValidDate - 有效日期返回 true', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('2024-01-01'))).toBe(true);
  });
  test('isValidDate - 无效日期返回 false', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false);
  });
  test('isValidDate - 非日期返回 false', () => {
    expect(isValidDate('2024-01-01' as any)).toBe(false);
  });
});

describe('isObject', () => {
  test('isObject - 对象和数组返回 true', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
  });
  test('isObject - null 和原始值返回 false', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('str')).toBe(false);
  });
});

describe('isPlainObject', () => {
  test('isPlainObject - 纯对象返回 true', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });
  test('isPlainObject - 数组返回 false', () => {
    expect(isPlainObject([])).toBe(false);
  });
  test('isPlainObject - null 返回 false', () => {
    expect(isPlainObject(null)).toBe(false);
  });
});

describe('isPromise', () => {
  test('isPromise - Promise 实例返回 true', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
  });
  test('isPromise - thenable 对象返回 true', () => {
    expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true);
  });
  test('isPromise - 非 Promise 返回 false', () => {
    expect(isPromise(123)).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise({})).toBe(false);
  });
});

describe('isWindow', () => {
  test('isWindow - window 返回 true', () => {
    expect(isWindow(window)).toBe(true);
  });
  test('isWindow - 非 window 返回 false', () => {
    expect(isWindow(document)).toBe(false);
    expect(isWindow({})).toBe(false);
  });
});

describe('isCurrentPageLink', () => {
  test('isCurrentPageLink - 锚点链接返回 true', () => {
    expect(isCurrentPageLink('#section')).toBe(true);
  });
  test('isCurrentPageLink - 同源同路径返回 true', () => {
    const path = window.location.pathname;
    expect(isCurrentPageLink(path)).toBe(true);
  });
  test('isCurrentPageLink - 外部链接返回 false', () => {
    expect(isCurrentPageLink('https://example.com/page')).toBe(false);
  });
});
