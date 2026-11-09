/**
 * OToast 轻提示 ARIA 契约测试。
 *
 * 默认 role="status"（polite）针对常规轻提示（"已复制""已保存"类被动反馈），
 * 不打断读屏用户正在朗读的内容；错误/警告类消息可透传 role="alert" 获得立即播报。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OToast from '../OToast.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OToast', () => {
  test('默认 role="status"', async () => {
    const screen = render(OToast, { props: { visible: true, duration: 0 }, slots: { default: () => 'toast' } });
    await flush();
    const el = screen.container.querySelector('.o-toast') as HTMLElement;
    expect(el.getAttribute('role')).toBe('status');
  });

  test('默认镜像 aria-live="polite" 与 aria-atomic="true"', async () => {
    const screen = render(OToast, { props: { visible: true, duration: 0 }, slots: { default: () => 'toast' } });
    await flush();
    const el = screen.container.querySelector('.o-toast') as HTMLElement;
    // 常规轻提示为礼貌级播报（polite），且整体播报（atomic）
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  test('传入自定义 role="alert" 可覆盖默认值，aria-live 联动为 assertive', async () => {
    const screen = render(OToast, {
      props: { visible: true, duration: 0, role: 'alert' },
      slots: { default: () => 'toast' },
    });
    await flush();
    const el = screen.container.querySelector('.o-toast') as HTMLElement;
    // 错误/警告类消息要求立即播报（assertive）
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });
});
