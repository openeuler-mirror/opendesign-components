/**
 * alignment 对齐工具单元测试。
 *
 * 覆盖：
 *   - calculateScrollTarget（对齐策略计算滚动目标位置）
 *   - resolveNearestAlign（解析 nearest 对齐方式）
 *   - createAxisSelector（轴选择器：垂直 / 水平模式切换）
 */
import { describe, expect, test } from 'vitest';
import { computed } from 'vue';
import { calculateScrollTarget, createAxisSelector, resolveNearestAlign, type SizeInfo, type ViewportInfo } from './alignment';

// ============================================================================
// calculateScrollTarget（对齐策略）
// ============================================================================

describe('calculateScrollTarget 对齐策略', () => {
  const sizes: SizeInfo = { containerSize: 300, itemSize: 80 };
  const itemTop = 800;

  test('align=start → scrollTop = itemTop', () => {
    expect(calculateScrollTarget(itemTop, 'start', sizes)).toBe(800);
  });

  test('align=end → scrollTop = itemTop - containerSize + itemSize', () => {
    // 800 - 300 + 80 = 580
    expect(calculateScrollTarget(itemTop, 'end', sizes)).toBe(580);
  });

  test('align=center → scrollTop = itemTop - containerSize/2 + itemSize/2', () => {
    // 800 - 150 + 40 = 690
    expect(calculateScrollTarget(itemTop, 'center', sizes)).toBe(690);
  });

  test('align=数字偏移 → scrollTop = itemTop - offset', () => {
    // 800 - 50 = 750
    expect(calculateScrollTarget(itemTop, 50, sizes)).toBe(750);
  });

  test('align=0 偏移 → scrollTop = itemTop（等同 start）', () => {
    expect(calculateScrollTarget(itemTop, 0, sizes)).toBe(800);
  });

  test('未知 align 值回退到 start', () => {
    // 传入非标准字符串，回退到 itemTop
    expect(calculateScrollTarget(itemTop, 'unknown' as any, sizes)).toBe(800);
  });
});

// ============================================================================
// resolveNearestAlign
// ============================================================================

describe('resolveNearestAlign 解析 nearest 对齐', () => {
  test('项完全在视口内 → 返回 null（无需滚动）', () => {
    const viewport: ViewportInfo = {
      currentScroll: 100,
      itemTop: 150,
      itemSize: 80,
      containerSize: 300,
    };
    // 100 + 300 = 400 > 150 + 80 = 230 → 项完全可见
    // currentScroll=100 > itemTop=150 → false
    // 100+300=400 > 230 → true → 不是上方也不是下方 → null
    expect(resolveNearestAlign(viewport)).toBeNull();
  });

  test('项在视口上方 → 返回 start', () => {
    const viewport: ViewportInfo = {
      currentScroll: 500,
      itemTop: 200,
      itemSize: 80,
      containerSize: 300,
    };
    // currentScroll=500 > itemTop=200 → 项在上方 → start
    expect(resolveNearestAlign(viewport)).toBe('start');
  });

  test('项在视口下方 → 返回 end', () => {
    const viewport: ViewportInfo = {
      currentScroll: 0,
      itemTop: 400,
      itemSize: 80,
      containerSize: 300,
    };
    // currentScroll=0 < itemTop=400 → 不在上方
    // 0+300=300 < 400+80=480 → 在下方 → end
    expect(resolveNearestAlign(viewport)).toBe('end');
  });

  test('项部分可见在视口下方 → 返回 end', () => {
    const viewport: ViewportInfo = {
      currentScroll: 0,
      itemTop: 280,
      itemSize: 80,
      containerSize: 300,
    };
    // 0+300=300 < 280+80=360 → 项底部在视口外 → end
    expect(resolveNearestAlign(viewport)).toBe('end');
  });

  test('项部分可见在视口上方 → 返回 start', () => {
    const viewport: ViewportInfo = {
      currentScroll: 250,
      itemTop: 200,
      itemSize: 80,
      containerSize: 300,
    };
    // currentScroll=250 > itemTop=200 → 项顶部在视口上方 → start
    expect(resolveNearestAlign(viewport)).toBe('start');
  });
});

// ============================================================================
// createAxisSelector（轴选择器）
// ============================================================================

describe('createAxisSelector 轴选择器', () => {
  /** @description 记录 scrollTo 调用参数 */
  let scrollToCalls: ScrollToOptions[] = [];

  /**
   * @description 创建模拟 HTMLElement 用于测试轴选择器
   * @param overrides 覆盖默认值的属性
   * @returns 模拟元素对象
   */
  function createMockElement(overrides: Record<string, number> = {}): HTMLElement {
    scrollToCalls = [];
    const el = {
      scrollTop: 0,
      scrollLeft: 0,
      offsetHeight: 300,
      offsetWidth: 400,
      scrollHeight: 8000,
      scrollWidth: 8000,
      clientHeight: 300,
      clientWidth: 400,
      scrollTo: (opts: ScrollToOptions) => {
        scrollToCalls.push(opts);
      },
    } as unknown as HTMLElement;
    Object.assign(el, overrides);
    return el;
  }

  test('垂直模式 - getScroll 返回 scrollTop', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement({ scrollTop: 400 });

    expect(axis.getScroll(el)).toBe(400);
  });

  test('垂直模式 - setScroll 设置 scrollTop', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    axis.setScroll(el, 800);
    expect((el as any).scrollTop).toBe(800);
  });

  test('垂直模式 - getAxisSize 返回 offsetHeight', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getAxisSize(el)).toBe(300);
  });

  test('垂直模式 - getScrollSize 返回 scrollHeight', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getScrollSize(el)).toBe(8000);
  });

  test('垂直模式 - getClientSize 返回 clientHeight', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getClientSize(el)).toBe(300);
  });

  test('垂直模式 - scrollToPos 调用 scrollTo({ top })', () => {
    const isHorizontal = computed(() => false);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    axis.scrollToPos(el, 400, 'instant');
    expect(scrollToCalls.length).toBe(1);
    expect(scrollToCalls[0]).toEqual({ top: 400, behavior: 'instant' });
  });

  test('水平模式 - getScroll 返回 scrollLeft', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement({ scrollLeft: 400 });

    expect(axis.getScroll(el)).toBe(400);
  });

  test('水平模式 - setScroll 设置 scrollLeft', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    axis.setScroll(el, 800);
    expect((el as any).scrollLeft).toBe(800);
  });

  test('水平模式 - getAxisSize 返回 offsetWidth', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getAxisSize(el)).toBe(400);
  });

  test('水平模式 - getScrollSize 返回 scrollWidth', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getScrollSize(el)).toBe(8000);
  });

  test('水平模式 - getClientSize 返回 clientWidth', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    expect(axis.getClientSize(el)).toBe(400);
  });

  test('水平模式 - scrollToPos 调用 scrollTo({ left })', () => {
    const isHorizontal = computed(() => true);
    const axis = createAxisSelector(isHorizontal);
    const el = createMockElement();

    axis.scrollToPos(el, 400, 'instant');
    expect(scrollToCalls.length).toBe(1);
    expect(scrollToCalls[0]).toEqual({ left: 400, behavior: 'instant' });
  });
});
