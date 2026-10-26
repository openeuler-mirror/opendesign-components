/**
 * useScrollState 滚动状态机单元测试。
 *
 * 覆盖：
 *   - 初始状态 isScrolling=false
 *   - markScrolling 设置 isScrolling=true
 *   - resetDelay 毫秒后自动重置
 *   - 连续 markScrolling 不提前重置
 *   - cleanup 清理定时器
 */
import { describe, expect, test } from 'vitest';
import { useScrollState } from './use-scroll-state';

describe('useScrollState 滚动状态机', () => {
  test('初始状态 isScrolling=false', () => {
    const { isScrolling } = useScrollState();
    expect(isScrolling.value).toBe(false);
  });

  test('markScrolling 设置 isScrolling=true', () => {
    const { isScrolling, markScrolling } = useScrollState();
    markScrolling();
    expect(isScrolling.value).toBe(true);
  });

  test('markScrolling 后 resetDelay 毫秒自动重置为 false', async () => {
    const { isScrolling, markScrolling, cleanup } = useScrollState({ resetDelay: 50 });
    markScrolling();
    expect(isScrolling.value).toBe(true);

    // 等待超过 resetDelay
    await new Promise((r) => setTimeout(r, 60));
    expect(isScrolling.value).toBe(false);

    cleanup();
  });

  test('连续多次 markScrolling 不提前重置', async () => {
    const { isScrolling, markScrolling, cleanup } = useScrollState({ resetDelay: 100 });

    markScrolling();
    // 50ms 后再次 markScrolling → 重置定时器
    await new Promise((r) => setTimeout(r, 50));
    markScrolling();
    expect(isScrolling.value).toBe(true);

    // 50ms 后还没超过新的 resetDelay → 应仍为 true
    await new Promise((r) => setTimeout(r, 50));
    expect(isScrolling.value).toBe(true);

    // 再等 60ms → 超过 resetDelay → 重置为 false
    await new Promise((r) => setTimeout(r, 60));
    expect(isScrolling.value).toBe(false);

    cleanup();
  });

  test('cleanup 清理定时器，不再自动重置', async () => {
    const { isScrolling, markScrolling, cleanup } = useScrollState({ resetDelay: 50 });
    markScrolling();
    expect(isScrolling.value).toBe(true);

    // 立即 cleanup → 清理定时器
    cleanup();

    // 等待超过 resetDelay → isScrolling 应保持 true（定时器已被清除）
    await new Promise((r) => setTimeout(r, 60));
    expect(isScrolling.value).toBe(true);
  });
});
