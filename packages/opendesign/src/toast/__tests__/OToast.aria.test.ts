/**
 * OToast 轻提示 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OToast from '../OToast.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OToast', () => {
  test('设 role="alert"', async () => {
    const screen = render(OToast, { props: { visible: true, duration: 0 }, slots: { default: () => 'toast' } });
    await flush();
    const el = screen.container.querySelector('.o-toast') as HTMLElement;
    expect(el.getAttribute('role')).toBe('alert');
  });
});
