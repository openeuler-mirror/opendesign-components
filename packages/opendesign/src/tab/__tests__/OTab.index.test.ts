/**
 * OTab 组件行为契约测试。
 *
 * 组织原则：
 *   1. 移动端滚动行为：scrollActiveIntoView 仅应水平滚动 nav 容器，
 *      不应触发页面垂直滚动（首屏下方的 OTab 不应把页面拉到 tab 位置）
 *
 * 不归属本文件的维度：
 *   - 不同断点下的尺寸数值 → OTab.responsive.test.ts
 *   - SSR 字符串渲染 + hydration → OTab.ssr.test.ts
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OTab from '../OTab.vue';
import OTabPane from '../OTabPane.vue';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { flush } from '../../../__tests__/_helpers/dom';

// ============================================================================
// 移动端滚动行为
//
// 背景：OTab 在 lePadV（≤840px）断点下启用横向滚动模式，onMounted / watch
// 会调用 scrollActiveIntoView 将激活页签在 nav 容器中水平居中。
//
// Bug：该函数使用 Element.scrollIntoView({ block: 'nearest', inline: 'center' })，
// 该 API 会滚动所有可滚动祖先——不仅水平滚动 nav 容器，还会在元素不可见时
// 触发页面垂直滚动，导致页面加载时自动跳到 tab 位置。
//
// 契约：scrollActiveIntoView 应仅操作 navsContainer 的 scrollLeft，
// 绝不改变 window.scrollY。
// ============================================================================

describe('移动端滚动行为（lePadV 断点）', () => {
  test('OTab onMounted - 组件位于首屏下方时不应触发页面垂直滚动', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);
    expect(window.scrollY).toBe(0);

    // 1000px 占位把 OTab 推到首屏之下（phone 视口高度 812px）
    render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab5' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    // 等待 onMounted + watch immediate 触发的 scrollActiveIntoView 执行完毕
    await flush();
    // smooth 滚动是异步的，额外等待确保滚动已发起
    await new Promise((r) => setTimeout(r, 300));

    // 核心断言：页面不应被垂直滚动到 tab 位置
    expect(window.scrollY).toBe(0);
  });

  test('OTab scrollActiveIntoView - Element.scrollIntoView 不应被调用（改用 scrollLeft）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const scrollIntoViewSpy = vi.spyOn(Element.prototype, 'scrollIntoView');

    render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab5' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 修复后应使用 container.scrollTo({ left }) 而非 element.scrollIntoView()
    // scrollIntoView 不应被 navEl 调用
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();

    scrollIntoViewSpy.mockRestore();
  });

  test('OTab scrollActiveIntoView - 激活页签在 nav 容器中水平居中（scrollLeft 被调整）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab7' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // nav 容器应有水平滚动（激活项 tab7 不是第一个，需要向右滚动才能居中）
    expect(container.scrollLeft).toBeGreaterThan(0);

    // 页面垂直位置不应改变
    expect(window.scrollY).toBe(0);
  });

  // ==========================================================================
  // 可见性验证：激活 tab 应在容器可视范围内完全可见（不被边缘裁切）
  // 注意：inline:'center' 语义为"尽量居中"，靠近两端时 scrollLeft 会被
  // clamp，此时激活项靠左/靠右而非居中，因此只验证完全可见而非中心对齐。
  // ==========================================================================

  test('OTab scrollActiveIntoView - 激活页签在 nav 容器可视范围内完全可见', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab7' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    const activeNav = screen.container.querySelector('.o-tab-nav-active') as HTMLElement;
    expect(activeNav).not.toBeNull();

    // 验证激活 tab 完全在容器可视范围内（不被左右边缘裁切）
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeNav.getBoundingClientRect();

    // 左边缘不超出容器左边界
    expect(activeRect.left).toBeGreaterThanOrEqual(containerRect.left - 1);
    // 右边缘不超出容器右边界
    expect(activeRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  });

  test('OTab scrollActiveIntoView - 激活首个页签时 scrollLeft 为 0（左边缘 clamp）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // 第一个 tab 已在左边缘，居中计算结果为负值，scrollTo 自动 clamp 到 0
    expect(container.scrollLeft).toBe(0);
  });

  test('OTab scrollActiveIntoView - 激活末尾页签时 scrollLeft 达到最大值（右边缘 clamp）', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () => h(OTab, { modelValue: 'tab10' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` })));
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 500));

    const container = screen.container.querySelector('.o-tab-navs-container') as HTMLElement;
    expect(container).not.toBeNull();

    // 最后一个 tab 应将 scrollLeft 推到最大值（scrollWidth - clientWidth）
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    expect(container.scrollLeft).toBeGreaterThan(0);
    // 应接近最大值（允许 smooth 滚动残余误差）
    expect(Math.abs(container.scrollLeft - maxScrollLeft)).toBeLessThanOrEqual(3);
  });

  test('OTab scrollActiveIntoView - 切换激活页签后仅水平滚动，不触发垂直滚动', async () => {
    await setViewport('phone');
    window.scrollTo(0, 0);

    const screen = render({
      setup() {
        return () =>
          h('div', {}, [
            h('div', { style: 'height: 1000px;' }),
            h(OTab, { modelValue: 'tab1' }, () => Array.from({ length: 10 }, (_, i) => h(OTabPane, { value: `tab${i + 1}`, label: `标签${i + 1}` }))),
          ]);
      },
    });

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 初始 scrollY 应为 0
    expect(window.scrollY).toBe(0);

    // 点击最后一个 tab 触发 scrollActiveIntoView（watch activeKey）
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    const lastNav = navs[navs.length - 1] as HTMLElement;
    expect(lastNav).toBeTruthy();
    lastNav.click();

    await flush();
    await new Promise((r) => setTimeout(r, 300));

    // 切换后页面垂直位置仍不应改变
    expect(window.scrollY).toBe(0);
  });
});
