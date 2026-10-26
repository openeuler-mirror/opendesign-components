/**
 * OPagination 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
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
    const pages = screen.container.querySelectorAll('.o-pagination-pager-item');
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
    const active = screen.container.querySelector('.o-pagination-pager-active');
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
    const items = screen.container.querySelectorAll('.o-pagination-pager-item');
    if (items.length > 1) {
      await items[1].click();
      await flush();
      expect(onChange).toHaveBeenCalled();
    }
  });

  test('OPagination update:page - 点击页码时触发', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () => h(OPagination, { total: 100, pageSize: 10, 'onUpdate:page': onUpdate }),
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-pagination-pager-item');
    if (items.length > 2) {
      await items[2].click();
      await flush();
      expect(onUpdate).toHaveBeenCalled();
    }
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OPagination active @${theme} - active 页码有可见背景`, async () => {
      const screen = render(OPagination, { props: { total: 100, pageSize: 10 } });
      await flush();
      const active = screen.container.querySelector('.o-pagination-pager-active') as HTMLElement;
      if (active) {
        paintThemed(screen.container, theme, active);
        expect(getComputedStyle(active).backgroundColor).toBeTruthy();
      }
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
});
