/**
 * OCard 卡片容器 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OCard from '../OCard.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OCard', () => {
  test('设 role="group"', async () => {
    const screen = render(OCard, {});
    await flush();
    const el = screen.container.querySelector('.o-card') as HTMLElement;
    expect(el.getAttribute('role')).toBe('group');
  });
});
