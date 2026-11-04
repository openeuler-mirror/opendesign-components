/**
 * OAnchor 导航地标 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OAnchor from '../OAnchor.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OAnchor', () => {
  test('根设 role="navigation"', async () => {
    const screen = render(OAnchor, {});
    await flush();
    const el = screen.container.querySelector('.o-anchor') as HTMLElement;
    expect(el.getAttribute('role')).toBe('navigation');
  });
});
