/**
 * OButton ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OButton from '../OButton.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 按钮', () => {
  test('disabled 时设 aria-disabled="true"', async () => {
    const screen = render(OButton, { props: { disabled: true }, slots: { default: () => 'B' } });
    await flush();
    const btn = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });

  test('loading 时设 aria-busy="true"', async () => {
    const screen = render(OButton, { props: { loading: true }, slots: { default: () => 'B' } });
    await flush();
    const btn = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  test('正常态无 aria-disabled / aria-busy', async () => {
    const screen = render(OButton, { slots: { default: () => 'B' } });
    await flush();
    const btn = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(btn.getAttribute('aria-disabled')).toBeNull();
    expect(btn.getAttribute('aria-busy')).toBeNull();
  });

  test('ariaLabel prop 透传到按钮', async () => {
    const screen = render(OButton, { props: { ariaLabel: '关闭' }, slots: { default: () => 'B' } });
    await flush();
    const btn = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBe('关闭');
  });
});
