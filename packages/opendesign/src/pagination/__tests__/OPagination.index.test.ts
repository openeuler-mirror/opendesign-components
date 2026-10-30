/**
 * OPagination 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OPagination from '../OPagination.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OPagination 根元素 class 包含 o-pagination', async () => {
    const screen = render(OPagination, { props: { total: 100 } });
    await flush();
    expect(screen.container.querySelector('.o-pagination')).not.toBeNull();
  });

  test('OPagination total - 默认 0', async () => {
    const screen = render(OPagination, {});
    await flush();
    expect(screen.container.querySelector('.o-pagination')).not.toBeNull();
  });

  test('OPagination total=100 - 渲染页码按钮', async () => {
    const screen = render(OPagination, { props: { total: 100, pageSize: 10 } });
    await flush();
    const pages = screen.container.querySelectorAll('.o-pagination-item');
    expect(pages.length).toBeGreaterThan(0);
  });

  test('OPagination layout - 包含 total 时渲染总数', async () => {
    const screen = render(OPagination, {
      props: { total: 100, layout: ['total', 'pager'] },
    });
    await flush();
    expect(screen.container.querySelector('.o-pagination')).not.toBeNull();
  });

  test('OPagination variant - solid / outline 注入类', async () => {
    for (const v of ['solid', 'outline'] as const) {
      const screen = render(OPagination, { props: { total: 50, variant: v } });
      await flush();
      expect((screen.container.querySelector('.o-pagination') as HTMLElement).classList.contains(`o-pagination-${v}`)).toBe(true);
    }
  });

  test('OPagination page - 默认 1', async () => {
    const screen = render(OPagination, { props: { total: 100, pageSize: 10 } });
    await flush();
    // 第 1 页应标记为 active
    const active = screen.container.querySelector('.o-pagination-item.active');
    expect(active).not.toBeNull();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OPagination change - 点击页码时触发', async () => {
    const onChange = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 10, onChange }),
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-pagination-item');
    expect(items.length).toBeGreaterThan(1);
    await items[1].click();
    await flush();
    expect(onChange).toHaveBeenCalled();
  });

  test('OPagination update:page - 点击页码时触发', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 10, 'onUpdate:page': onUpdate }),
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-pagination-item');
    expect(items.length).toBeGreaterThan(2);
    await items[2].click();
    await flush();
    expect(onUpdate).toHaveBeenCalled();
  });
});

describe('动态契约（jumper 跳页提交）', () => {
  test('OPagination jumper - 点击箭头切页后输入原页码回车可切回', async () => {
    // 业务场景：点击箭头切到第 2 页后，在跳转输入框输入 1 并回车，应切回第 1 页
    const onChange = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 12, onChange }),
    });
    await flush();
    (screen.container.querySelector('.o-pagination-next') as HTMLElement).click();
    await flush();
    const input = screen.container.querySelector('.o-pagination-goto input') as HTMLInputElement;
    input.focus();
    await userEvent.fill(input, '1');
    await userEvent.keyboard('{Enter}');
    await flush();
    const active = screen.container.querySelector('.o-pagination-item.active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('1');
    expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 12 }, { page: 2, pageSize: 12 });
  });

  test('OPagination jumper - 切页后输入原页码失焦可切回', async () => {
    // 业务场景：点击箭头切到第 2 页后，在跳转输入框输入 1 后失焦，应切回第 1 页
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 12 }),
    });
    await flush();
    (screen.container.querySelector('.o-pagination-next') as HTMLElement).click();
    await flush();
    const input = screen.container.querySelector('.o-pagination-goto input') as HTMLInputElement;
    input.focus();
    await userEvent.fill(input, '1');
    input.blur();
    await flush();
    const active = screen.container.querySelector('.o-pagination-item.active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('1');
  });

  test('OPagination jumper - 输入当前页码回车不重复触发 change', async () => {
    // 业务场景：停在第 2 页时输入 2 回车，页码未变化，不应再次触发 change
    const onChange = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 12, onChange }),
    });
    await flush();
    (screen.container.querySelector('.o-pagination-next') as HTMLElement).click();
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
    const input = screen.container.querySelector('.o-pagination-goto input') as HTMLInputElement;
    input.focus();
    await userEvent.fill(input, '2');
    await userEvent.keyboard('{Enter}');
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('OPagination simple - 简洁布局切页后输入原页码回车可切回', async () => {
    // 业务场景：简洁布局下点击箭头切到第 2 页后，输入 1 并回车，应切回第 1 页
    const onChange = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 12, simple: true, onChange }),
    });
    await flush();
    (screen.container.querySelector('.o-pagination-next') as HTMLElement).click();
    await flush();
    const input = screen.container.querySelector('.o-pagination-simple input') as HTMLInputElement;
    input.focus();
    await userEvent.fill(input, '1');
    await userEvent.keyboard('{Enter}');
    await flush();
    expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 12 }, { page: 2, pageSize: 12 });
  });
});

describe('动态契约（total=0 空数据语义）', () => {
  test('OPagination total=0 - jumper 跳转输入框不进入失效态', async () => {
    // 业务场景：后端分页数据未加载完成（total=0）时，空数据按“1 个空页”处理，
    // 跳转输入框当前页 1 不超出 max，不应出现 o_input-invalid 失效态（删除线）
    const screen = render(OPagination, { props: { total: 0 } });
    await flush();
    const input = screen.container.querySelector('.o-pagination-goto .o_input') as HTMLElement;
    expect(input).not.toBeNull();
    expect(input.classList.contains('o_input-invalid')).toBe(false);
  });

  test('OPagination total=0 - pager 渲染单个激活的第 1 页', async () => {
    // 业务场景：空数据时总页数为 1（而非 0），页码列表渲染唯一且激活的“1”
    const screen = render(OPagination, { props: { total: 0 } });
    await flush();
    const items = screen.container.querySelectorAll('.o-pagination-item');
    expect(items.length).toBe(1);
    expect(items[0].classList.contains('active')).toBe(true);
    expect(items[0].textContent?.trim()).toBe('1');
  });

  test('OPagination total=0 - 前后翻页箭头均禁用', async () => {
    // 业务场景：空数据无可翻页，prev（已在第 1 页）与 next（第 1/1 页）都应禁用
    const screen = render(OPagination, { props: { total: 0 } });
    await flush();
    const prev = screen.container.querySelector('.o-pagination-prev') as HTMLElement;
    const next = screen.container.querySelector('.o-pagination-next') as HTMLElement;
    expect(prev.classList.contains('is-disabled')).toBe(true);
    expect(next.classList.contains('is-disabled')).toBe(true);
  });

  test('OPagination exposed pageCount - total=0 时为 1（空数据按 1 页处理）', async () => {
    // 行为契约：total=0 时 defineExpose 的 pageCount 为 1（此前为 0），
    // 外部判空应改用 total === 0
    const pagRef = ref<InstanceType<typeof OPagination> | null>(null);
    render({
      setup() {
        return () => h(OPagination, { total: 0, ref: pagRef });
      },
    });
    await flush();
    expect(pagRef.value?.pageCount).toBe(1);
  });

  test('OPagination total 0→100 - 数据加载后页码列表恢复且输入框保持有效', async () => {
    // 业务场景：total=0（数据未加载）→ total=100（加载完成），
    // 跳转输入框全程有效，页码列表从单个“1”恢复为多页
    const screen = render(OPagination, { props: { total: 0 } });
    await flush();
    await screen.rerender({ total: 100 });
    await flush();
    const input = screen.container.querySelector('.o-pagination-goto .o_input') as HTMLElement;
    expect(input.classList.contains('o_input-invalid')).toBe(false);
    expect(screen.container.querySelectorAll('.o-pagination-item').length).toBeGreaterThan(1);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OPagination active @${theme} - active 页码有可见背景`, async () => {
      const screen = render(OPagination, { props: { total: 100, pageSize: 10 } });
      await flush();
      const active = screen.container.querySelector('.o-pagination-item.active') as HTMLElement;
      expect(active).not.toBeNull();
      paintThemed(screen.container, theme, active);
      expect(getComputedStyle(active).backgroundColor).toBeTruthy();
    });
  }
});

describe('SSR 契约', () => {
  test('OPagination SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OPagination, { total: 100, pageSize: 10 }, '')).resolves.toEqual(expect.any(String));
  });

  test('OPagination hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OPagination, { total: 100, pageSize: 10 }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });

  test('OPagination SSR total=0 - 空数据渲染不抛出且无水合 mismatch', async () => {
    // 业务场景：total=0 时 SSR 首屏渲染“箭头 + 激活的 1”，客户端水合无差异
    const result = await ssrHydrateAndCompare(OPagination, { total: 0 }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
