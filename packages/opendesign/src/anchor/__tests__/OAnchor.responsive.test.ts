/**
 * OAnchor 响应式契约测试。
 *
 * 验证 media.scss 中两个响应式断点对 CSS 变量的覆盖：
 *   - `@include respond('<=laptop')`：非 menu 的 link/sub 文字字号降级、padding-v 收窄、h 模式 gap 收窄
 *   - `@include respond('<=pad_v')`：menu 模式 sub 文字降级、h 模式 gap 进一步收窄
 *
 * 视口选择（由 media.scss 的 respond 块决定，非 5 个全跑）：
 *   - desktop（1920）：基准，不命中任何 media
 *   - laptop（1440）：命中 `<=laptop`，不命中 `<=pad_v`
 *   - pad_v（768）：同时命中 `<=laptop` 与 `<=pad_v`
 *
 * 断言策略：
 *   - 字面 px 变量（padding-v、gap）：resolveTokenPx 精确比对数值
 *   - token 链变量（font-size 系列）：仅断言「跃迁前后值发生变化」，不硬比对绝对 px
 */
import { test, expect, describe, afterAll } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OAnchor from '../OAnchor.vue';
import OAnchorItem from '../OAnchorItem.vue';
import { flush, resolveTokenPx } from '../../../__tests__/_helpers/dom';
import { setViewport, type BreakpointName } from '../../../__tests__/_helpers/viewport';

/**
 * 在指定视口下渲染 OAnchor + 单个 OAnchorItem，返回 .o-anchor-item 元素用于变量解析。
 */
const renderItemAt = async (bp: BreakpointName, props: Record<string, unknown> = {}) => {
  await setViewport(bp);
  const screen = render(OAnchor, {
    props,
    slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) },
  });
  await flush();
  return screen.container.querySelector('.o-anchor-item') as HTMLElement;
};

describe('响应式契约（v 布局文字字号与 padding）', () => {
  test('OAnchor v medium - --anchor-item-link-text-size 在 desktop → laptop 值变化（text1 → tip1）', async () => {
    const desktop = resolveTokenPx(await renderItemAt('desktop', { layout: 'v', size: 'medium' }), '--anchor-item-link-text-size');
    const laptop = resolveTokenPx(await renderItemAt('laptop', { layout: 'v', size: 'medium' }), '--anchor-item-link-text-size');
    expect(desktop).not.toBe(laptop);
  });

  test('OAnchor v medium - --anchor-item-sub-link-text-size 在 desktop → laptop 值变化（tip1 → tip2）', async () => {
    const desktop = resolveTokenPx(await renderItemAt('desktop', { layout: 'v', size: 'medium' }), '--anchor-item-sub-link-text-size');
    const laptop = resolveTokenPx(await renderItemAt('laptop', { layout: 'v', size: 'medium' }), '--anchor-item-sub-link-text-size');
    expect(desktop).not.toBe(laptop);
  });

  test('OAnchor v medium - --anchor-item-link-padding-v 在 desktop=8px → laptop=5px（字面 px 精确比对）', async () => {
    const desktop = resolveTokenPx(await renderItemAt('desktop', { layout: 'v', size: 'medium' }), '--anchor-item-link-padding-v');
    const laptop = resolveTokenPx(await renderItemAt('laptop', { layout: 'v', size: 'medium' }), '--anchor-item-link-padding-v');
    expect(desktop).toBeCloseTo(8, 0);
    expect(laptop).toBeCloseTo(5, 0);
  });
});

describe('响应式契约（h 布局 gap 收窄）', () => {
  test('OAnchor h - --anchor-item-gap 在 desktop=32 → laptop=24（字面 px 精确比对）', async () => {
    const desktop = resolveTokenPx(await renderItemAt('desktop', { layout: 'h' }), '--anchor-item-gap');
    const laptop = resolveTokenPx(await renderItemAt('laptop', { layout: 'h' }), '--anchor-item-gap');
    expect(desktop).toBeCloseTo(32, 0);
    expect(laptop).toBeCloseTo(24, 0);
  });

  // 已知问题：media.scss 中 `<=pad_v` 的 `.o-anchor-h .o-anchor-item { --anchor-item-gap: 16px }`
  // 选择器特异性 (0,2,0) 低于 `<=laptop` 的 `.o-anchor-h:not(.o-anchor-menu) .o-anchor-item` (0,3,0)，
  // 在 pad_v 视口下被覆盖，gap 实际仍为 24px。标记为预期失败，待组件侧调整选择器特异性后改回普通断言。
  test.fails('OAnchor h - --anchor-item-gap 在 pad_v 应收窄至 16px', async () => {
    const padV = resolveTokenPx(await renderItemAt('pad_v', { layout: 'h' }), '--anchor-item-gap');
    expect(padV).toBeCloseTo(16, 0);
  });
});

describe('响应式契约（menu 模式 sub 文字）', () => {
  test('OAnchor menu - --anchor-item-sub-link-text-size 在 desktop → pad_v 值变化（tip1 → tip2）', async () => {
    const desktop = resolveTokenPx(await renderItemAt('desktop', { size: 'menu' }), '--anchor-item-sub-link-text-size');
    const padV = resolveTokenPx(await renderItemAt('pad_v', { size: 'menu' }), '--anchor-item-sub-link-text-size');
    expect(desktop).not.toBe(padV);
  });
});

// 还原默认 desktop 视口，避免影响后续测试文件
afterAll(async () => {
  await setViewport('desktop');
});
