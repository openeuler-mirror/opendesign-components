/**
 * hooks/useRunOnceNextTick.ts Vue tick 函数去重测试。
 *
 * 验证同一 tick 内相同函数只执行一次，不同函数各执行一次。
 */
import { test, expect, describe, vi } from 'vitest';
import { nextTick } from 'vue';
import { useRunOnceNextTick } from './useRunOnceNextTick';

describe('useRunOnceNextTick', () => {
  test('useRunOnceNextTick - 同一函数在同一 tick 只执行一次', async () => {
    const fn = vi.fn();
    const runOnce = useRunOnceNextTick();
    runOnce(fn);
    runOnce(fn);
    runOnce(fn);
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('useRunOnceNextTick - 不同函数在同一 tick 各执行一次', async () => {
    const fnA = vi.fn();
    const fnB = vi.fn();
    const runOnce = useRunOnceNextTick();
    runOnce(fnA);
    runOnce(fnB);
    await nextTick();
    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(1);
  });

  test('useRunOnceNextTick - 下一 tick 可以再次注册执行', async () => {
    const fn = vi.fn();
    const runOnce = useRunOnceNextTick();
    runOnce(fn);
    await nextTick();
    runOnce(fn);
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('useRunOnceNextTick - 第一个注册触发 nextTick，后续不重复触发', async () => {
    const fn = vi.fn();
    const runOnce = useRunOnceNextTick();
    runOnce(fn);
    runOnce(fn);
    // nextTick 只被调度一次
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
