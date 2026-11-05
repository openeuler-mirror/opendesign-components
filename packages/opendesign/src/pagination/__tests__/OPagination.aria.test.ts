/**
 * OPagination ARIA 无障碍契约测试。
 *
 * 验证导航地标（role="navigation" + aria-label）与当前页
 * aria-current="page" 状态镜像，使屏幕阅读器能识别分页导航
 * 区域与当前位置。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
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
});
