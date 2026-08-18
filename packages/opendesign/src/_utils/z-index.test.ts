/**
 * _utils/z-index.ts z-index 管理测试。
 *
 * 覆盖 getZIndex / createTopZIndex / watchEffect 同步逻辑。
 * 浏览器模式下 vi.resetModules 无法重置模块状态，
 * 因此采用单测试内顺序验证，或通过 initZIndex 显式控制起点。
 */
import { test, expect, describe } from 'vitest';
import { nextTick } from 'vue';
import { getZIndex, createTopZIndex } from './z-index';
import { initZIndex } from './global';

describe('z-index 管理', () => {
  test('createTopZIndex 单调递增，getZIndex 返回当前值', () => {
    const before = getZIndex();
    const next = createTopZIndex();
    expect(next).toBe(before + 1);
    expect(getZIndex()).toBe(next);
  });

  test('defaultZIndex 变更同步：较大值生效，较小值不回退', async () => {
    const base = getZIndex();
    createTopZIndex();
    initZIndex(base + 5000);
    await nextTick();
    expect(getZIndex()).toBe(base + 5000);
    createTopZIndex();
    initZIndex(500);
    await nextTick();
    expect(getZIndex()).toBe(base + 5001);
  });
});
