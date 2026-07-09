/**
 * _utils/z-index.ts z-index 管理测试。
 *
 * 覆盖 getZIndex / createTopZIndex / removeZIndex。
 * 每个测试通过 beforeEach 重置 topZIndex 到 1000，确保隔离。
 */
import { test, expect, describe, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { getZIndex, createTopZIndex, removeZIndex } from './z-index';
import { initZIndex } from './global';

beforeEach(async () => {
  // 改变再恢复 defaultZIndex，触发 watchEffect 同步 topZIndex 到 1000
  initZIndex(0);
  initZIndex(1000);
  await nextTick();
});

describe('z-index 管理', () => {
  test('getZIndex - 返回当前顶层 z-index 值', () => {
    expect(getZIndex()).toBe(1000);
  });

  test('createTopZIndex - 每次调用递增 1', () => {
    expect(createTopZIndex()).toBe(1001);
    expect(getZIndex()).toBe(1001);
  });

  test('removeZIndex - 不传参数时递减 1', () => {
    createTopZIndex(); // → 1001
    createTopZIndex(); // → 1002
    removeZIndex();
    expect(getZIndex()).toBe(1001);
  });

  test('removeZIndex - 传入当前值时递减', () => {
    const current = createTopZIndex(); // → 1001
    removeZIndex(current);
    expect(getZIndex()).toBe(1000);
  });

  test('removeZIndex - 传入非当前值时不递减', () => {
    createTopZIndex(); // → 1001
    removeZIndex(999); // 不匹配当前值
    expect(getZIndex()).toBe(1001);
  });
});
