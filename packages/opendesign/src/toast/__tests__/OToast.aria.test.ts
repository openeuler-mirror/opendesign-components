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

  test('镜像 aria-live="assertive" 与 aria-atomic="true"', async () => {
    const screen = render(OToast, { props: { visible: true, duration: 0 }, slots: { default: () => 'toast' } });
    await flush();
    const el = screen.container.querySelector('.o-toast') as HTMLElement;
    // 轻提示级消息要求立即播报（assertive），且整体播报（atomic）
    expect(el.getAttribute('aria-live')).toBe('assertive');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });
});
