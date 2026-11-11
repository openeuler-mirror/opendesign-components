/**
 * OPagination ARIA 无障碍契约测试。
 *
 * 验证导航地标（role="navigation" + aria-label）与当前页
 * aria-current="page" 状态镜像，使屏幕阅读器能识别分页导航
 * 区域与当前位置。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import { userEvent } from 'vitest/browser';
import OPagination from '../OPagination.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 分页导航', () => {
  test('根元素设 role="navigation" 与默认 aria-label', async () => {
    const screen = render(OPagination, { props: { total: 50 } });
    await flush();
    const nav = screen.container.querySelector('.o-pagination') as HTMLElement;
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBeTruthy();
  });

  test('当前页项设 aria-current="page"', async () => {
    const screen = render(OPagination, { props: { total: 50, page: 2 } });
    await flush();
    const current = screen.container.querySelector('[aria-current="page"]');
    expect(current).not.toBeNull();
  });

  test('aria-current="page" 精确落在 modelValue 对应页项上，切页后镜像移动', async () => {
    // 通过 v-model:page 驱动当前页，验证 aria-current 与当前页同构镜像
    const page = ref(2);
    const screen = render({
      setup() {
        return () =>
          h(OPagination as any, {
            total: 50,
            page: page.value,
            'onUpdate:page': (v: number) => {
              page.value = v;
            },
          });
      },
    });
    await flush();
    // 初始：唯一携带 aria-current 的页项文本恰为「2」
    const current = screen.container.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.textContent?.trim()).toBe('2');
    // 点击页项「3」切换
    const target = [...screen.container.querySelectorAll('.o-pagination-item')].find((el) => el.textContent?.trim() === '3') as HTMLElement;
    target.click();
    await flush();
    // 镜像移动到「3」，且全局唯一
    const currents = screen.container.querySelectorAll('[aria-current="page"]');
    expect(currents.length).toBe(1);
    expect(currents[0].textContent?.trim()).toBe('3');
    expect(page.value).toBe(3);
  });

  test('ariaLabel 显式传入时覆盖默认词条', async () => {
    const screen = render(OPagination, { props: { total: 50, pageSize: 10, ariaLabel: '搜索结果分页' } });
    await flush();
    const nav = screen.container.querySelector('.o-pagination') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('搜索结果分页');
  });
});

describe('ARIA — more 弹层虚拟列表', () => {
  test('more 弹层虚拟路径的选项不夹中间 list/listitem 语义层', async () => {
    // totalPage > showPageCount 出现 more 项；more 列表 > 50 条走 OVirtualList 虚拟路径
    const screen = render({ setup: () => () => h(OPagination, { total: 1000, pageSize: 10, page: 1 }) });
    await flush();
    // 页码省略出现 more 图标，悬停弹出含虚拟列表的弹层（OPopover 默认 hover 触发）
    const moreIcon = screen.container.querySelector('.o-pagination-more-icon-wrap') as HTMLElement;
    expect(moreIcon).toBeTruthy();
    await userEvent.hover(moreIcon);
    // 弹层带默认 hoverDelay，等待其挂载
    await vi.waitFor(() => expect(document.querySelector('.o-options-popup')).toBeTruthy(), { timeout: 2000 });
    const popup = document.querySelector('.o-options-popup') as HTMLElement;
    // 虚拟列表渲染的选项直接暴露在弹层结构中，不夹 list/listitem 中间语义层
    //（若日后弹层补 role=listbox，中间层会破坏「子节点只能是 option」的 ARIA 契约）
    const options = popup.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(popup.querySelectorAll('[role="list"]').length).toBe(0);
    expect(popup.querySelectorAll('[role="listitem"]').length).toBe(0);
  });
});
