/**
 * _utils/helper.ts 通用工具函数测试。
 *
 * 覆盖 debounce / debounceRAF / throttleRAF / ColorPool / uniqueId /
 * chunk / asyncSome / getValueByPath / setValueByPath / moveToFirst /
 * formateToString / pick / promiseWithResolvers。
 */
import { test, expect, describe, vi } from 'vitest';
import {
  debounce,
  debounceRAF,
  throttleRAF,
  ColorPool,
  uniqueId,
  chunk,
  asyncSome,
  getValueByPath,
  setValueByPath,
  moveToFirst,
  formateToString,
  pick,
  promiseWithResolvers,
} from './helper';

describe('debounce', () => {
  test('debounce - leading=true 首次立即执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('debounce - leading=true 等待期间后续调用不立即执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);
    debounced(); // 立即执行
    debounced(); // 等待期间调用，不执行
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // trailing=false，不再执行
    vi.useRealTimers();
  });

  test('debounce - leading=true trailing=true 等待结束后再执行一次', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true, true);
    debounced(); // 立即执行（第1次）
    debounced(); // 等待期间调用，标记 trailing
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2); // trailing 执行（第2次）
    vi.useRealTimers();
  });

  test('debounce - leading=false 延迟执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, false as any);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('debounce - leading=true trailing=true 等待期间无后续调用时不触发 trailing', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true, true);
    debounced(); // 立即执行（第1次），等待期间无后续调用
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // 无后续调用，不触发 trailing
    vi.useRealTimers();
  });
});

describe('debounceRAF', () => {
  test('debounceRAF - 多次调用只执行一次（下一帧）', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounceRAF(fn);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('debounceRAF - cancel 取消待执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounceRAF(fn);
    debounced();
    debounced.cancel();
    vi.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('throttleRAF', () => {
  test('throttleRAF - 一帧内只执行一次', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttleRAF(fn);
    throttled();
    throttled(); // 同一帧内，不执行
    expect(fn).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('throttleRAF - cancel 取消待执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttleRAF(fn);
    throttled();
    throttled.cancel();
    vi.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('ColorPool', () => {
  test('ColorPool - pick(index) 返回指定位置颜色', () => {
    const pool = new ColorPool(['red', 'green', 'blue']);
    expect(pool.pick(0)).toBe('red');
    expect(pool.pick(1)).toBe('green');
    expect(pool.pick(2)).toBe('blue');
  });

  test('ColorPool - pick(index) 超出长度时取模', () => {
    const pool = new ColorPool(['red', 'green']);
    expect(pool.pick(0)).toBe('red');
    expect(pool.pick(1)).toBe('green');
    expect(pool.pick(2)).toBe('red');
    expect(pool.pick(3)).toBe('green');
  });

  test('ColorPool - pick() 随机取色且不重复', () => {
    const pool = new ColorPool(['a', 'b', 'c']);
    const picked = new Set<string>();
    picked.add(pool.pick()!);
    picked.add(pool.pick()!);
    picked.add(pool.pick()!);
    expect(picked.size).toBe(3); // 三个颜色各不相同
  });

  test('ColorPool - tmpPool 耗尽后自动重置', () => {
    const pool = new ColorPool(['x', 'y']);
    pool.pick();
    pool.pick();
    // tmpPool 已空，下次 pick 应自动重置
    const color = pool.pick();
    expect(['x', 'y']).toContain(color);
  });
});

describe('uniqueId', () => {
  test('uniqueId - 无参数时返回随机字符串', () => {
    const id = uniqueId();
    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(id.length).toBe(8);
  });

  test('uniqueId - 带前缀时返回 prefix-id 格式', () => {
    const id = uniqueId('o-btn');
    expect(id).toMatch(/^o-btn-[a-z0-9]+$/);
  });

  test('uniqueId - 指定长度时返回对应长度', () => {
    const id = uniqueId('', 12);
    const parts = id.split('');
    expect(parts.length).toBeGreaterThanOrEqual(12);
  });

  test('uniqueId - 多次调用返回不同值', () => {
    const id1 = uniqueId();
    const id2 = uniqueId();
    expect(id1).not.toBe(id2);
  });
});

describe('chunk', () => {
  test('chunk - 将数组分成指定大小的块', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('chunk - size=1 时每项单独成块', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  test('chunk - 空数组返回空数组', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  test('chunk - 默认 size=1', () => {
    expect(chunk([1, 2])).toEqual([[1], [2]]);
  });
});

describe('asyncSome', () => {
  test('asyncSome - 有匹配项时返回 true', async () => {
    const result = await asyncSome([1, 2, 3], async (n) => n === 2);
    expect(result).toBe(true);
  });

  test('asyncSome - 无匹配项时返回 false', async () => {
    const result = await asyncSome([1, 2, 3], async (n) => n === 5);
    expect(result).toBe(false);
  });

  test('asyncSome - judgeFn 抛异常时返回 false', async () => {
    const result = await asyncSome([1, 2], async () => {
      throw new Error('test');
    });
    expect(result).toBe(false);
  });

  test('asyncSome - 空数组返回 false', async () => {
    const result = await asyncSome([], async () => true);
    expect(result).toBe(false);
  });
});

describe('getValueByPath', () => {
  test('getValueByPath - 正常路径获取值', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getValueByPath(obj, 'a.b.c')).toBe(42);
  });

  test('getValueByPath - 路径不存在时返回 undefined', () => {
    const obj = { a: { b: 1 } };
    expect(getValueByPath(obj, 'a.c')).toBeUndefined();
  });

  test('getValueByPath - 空对象或空路径返回 undefined', () => {
    expect(getValueByPath({}, 'a.b')).toBeUndefined();
    expect(getValueByPath({ a: 1 }, '')).toBeUndefined();
  });

  test('getValueByPath - 中间节点非对象时返回 undefined', () => {
    const obj = { a: 1 };
    expect(getValueByPath(obj, 'a.b')).toBeUndefined();
  });
});

describe('setValueByPath', () => {
  test('setValueByPath - 正常设置深层值', () => {
    const obj = { a: { b: { c: 0 } } };
    setValueByPath(obj, 'a.b.c', 99);
    expect(obj.a.b.c).toBe(99);
  });

  test('setValueByPath - 路径不存在时自动创建中间节点', () => {
    const obj: any = {};
    setValueByPath(obj, 'a.b.c', 'val');
    expect(obj.a.b.c).toBe('val');
  });

  test('setValueByPath - 数字索引自动创建数组', () => {
    const obj: any = {};
    setValueByPath(obj, 'a.1.b', 'val');
    expect(Array.isArray(obj.a)).toBe(true);
    expect(obj.a[1].b).toBe('val');
  });
});

describe('moveToFirst', () => {
  test('moveToFirst - 将指定项移到首位', () => {
    expect(moveToFirst([1, 2, 3, 4], 3)).toEqual([3, 1, 2, 4]);
  });

  test('moveToFirst - 首项不变', () => {
    expect(moveToFirst([1, 2, 3], 1)).toEqual([1, 2, 3]);
  });

  test('moveToFirst - 不存在的项返回原数组', () => {
    expect(moveToFirst([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });
});

describe('formateToString', () => {
  test('formateToString - 字符串原样返回', () => {
    expect(formateToString('hello')).toBe('hello');
  });

  test('formateToString - 数字转字符串', () => {
    expect(formateToString(123)).toBe('123');
  });

  test('formateToString - undefined / null 返回空字符串', () => {
    expect(formateToString(undefined)).toBe('');
    expect(formateToString(null)).toBe('');
  });

  test('formateToString - NaN 返回空字符串', () => {
    expect(formateToString(NaN)).toBe('');
  });

  test('formateToString - 纯对象返回空字符串', () => {
    expect(formateToString({ a: 1 })).toBe('');
  });
});

describe('pick', () => {
  test('pick - 从对象中挑选指定属性', () => {
    const result = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('pick - 不存在的属性不包含在结果中', () => {
    const result = pick({ a: 1 }, ['a', 'b']);
    expect(result).toEqual({ a: 1 });
  });

  test('pick - 空键数组返回空对象', () => {
    const result = pick({ a: 1, b: 2 }, []);
    expect(result).toEqual({});
  });
});

describe('promiseWithResolvers', () => {
  test('promiseWithResolvers - resolve 正常工作', async () => {
    const { promise, resolve } = promiseWithResolvers<number>();
    resolve(42);
    expect(await promise).toBe(42);
  });

  test('promiseWithResolvers - reject 正常工作', async () => {
    const { promise, reject } = promiseWithResolvers();
    reject(new Error('fail'));
    await expect(promise).rejects.toThrow('fail');
  });

  test('promiseWithResolvers - 返回的对象包含 promise / resolve / reject', () => {
    const result = promiseWithResolvers();
    expect(result).toHaveProperty('promise');
    expect(result).toHaveProperty('resolve');
    expect(result).toHaveProperty('reject');
    expect(result.promise).toBeInstanceOf(Promise);
    expect(typeof result.resolve).toBe('function');
    expect(typeof result.reject).toBe('function');
  });
});
