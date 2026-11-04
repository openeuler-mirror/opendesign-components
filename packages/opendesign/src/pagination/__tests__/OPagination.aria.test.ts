/**
 * OPagination ARIA 无障碍契约测试。
 *
 * 验证导航地标（role="navigation" + aria-label）与当前页
 * aria-current="page" 状态镜像，使屏幕阅读器能识别分页导航
 * 区域与当前位置。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
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
    const screen = render(OPagination, { props: { total: 50, modelValue: 2 } });
    await flush();
    const current = screen.container.querySelector('[aria-current="page"]');
    expect(current).not.toBeNull();
  });
});
