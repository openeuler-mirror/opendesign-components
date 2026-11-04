/**
 * OCarousel ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCarousel from '../OCarousel.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 轮播', () => {
  test('根设 role="region"', async () => {
    const screen = render(OCarousel, {
      slots: { default: () => [h('div', 'A'), h('div', 'B')] },
    });
    await flush();
    const root = screen.container.querySelector('.o-carousel') as HTMLElement;
    expect(root.getAttribute('role')).toBe('region');
  });

  test('ariaLabel prop 透传到根', async () => {
    const screen = render(OCarousel, {
      props: { ariaLabel: '轮播图' },
      slots: { default: () => h('div', 'A') },
    });
    await flush();
    const root = screen.container.querySelector('.o-carousel') as HTMLElement;
    expect(root.getAttribute('aria-label')).toBe('轮播图');
  });

  test('未传 ariaLabel 时不渲染 aria-label 属性', async () => {
    const screen = render(OCarousel, { slots: { default: () => h('div', 'A') } });
    await flush();
    const root = screen.container.querySelector('.o-carousel') as HTMLElement;
    expect(root.getAttribute('aria-label')).toBeNull();
  });
});
