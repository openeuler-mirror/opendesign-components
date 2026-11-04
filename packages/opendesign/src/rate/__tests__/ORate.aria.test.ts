/**
 * ORate ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import ORate from '../ORate.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 评分', () => {
  test('根设 role="radiogroup"，项设 role="radio" 并镜像 aria-checked', async () => {
    const screen = render(ORate, { props: { modelValue: 3, count: 5 } });
    await flush();
    const root = screen.container.querySelector('.o-rate') as HTMLElement;
    expect(root.getAttribute('role')).toBe('radiogroup');
    const items = screen.container.querySelectorAll('.o-rate-item');
    expect(items.length).toBe(5);
    expect(items[0].getAttribute('role')).toBe('radio');
    expect(items[0].getAttribute('aria-checked')).toBe('true');
    expect(items[4].getAttribute('aria-checked')).toBe('false');
  });
});
