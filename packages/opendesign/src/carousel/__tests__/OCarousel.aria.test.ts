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
      props: { indicatorClick: true },
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

  test('指示器镜像 aria-current="true"（仅当前项），并带第 N/共 M 张可访问名称', async () => {
    const screen = render(OCarousel, {
      slots: { default: () => [h('div', 'A'), h('div', 'B'), h('div', 'C')] },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-carousel-indicator-item');
    expect(items.length).toBe(3);
    const currents = Array.from(items).map((el) => el.getAttribute('aria-current'));
    expect(currents).toEqual(['true', null, null]);
    // 名称非空且可区分
    expect(items[0].getAttribute('aria-label')).toBeTruthy();
    expect(items[2].getAttribute('aria-label')).not.toBe(items[0].getAttribute('aria-label'));
  });

  test('切换幻灯片后 aria-current 跟随移动', async () => {
    const screen = render(OCarousel, {
      props: { indicatorClick: true },
      slots: { default: () => [h('div', 'A'), h('div', 'B')] },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-carousel-indicator-item');
    (items[1] as HTMLElement).click();
    await flush();
    const currents = Array.from(items).map((el) => el.getAttribute('aria-current'));
    expect(currents).toEqual([null, 'true']);
  });
});
