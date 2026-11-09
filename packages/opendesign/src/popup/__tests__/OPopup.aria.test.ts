/**
 * OPopup ARIA 无障碍契约测试。
 *
 * 验证 opt-in role prop：role='dialog' 时弹层根设 role + aria-modal，
 * role='tooltip' 时仅 role 无 aria-modal，未传时不渲染 role 属性。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OPopup from '../OPopup.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const cleanup = () => {
  document.body.querySelectorAll('.o-popup').forEach((el) => el.remove());
};

describe('ARIA — 弹层根', () => {
  afterEach(cleanup);

  test('role="dialog" - 弹层根设 role=dialog 且 aria-modal=true', async () => {
    const screen = render(OPopup, { props: { visible: true, wrapper: null, role: 'dialog' }, slots: { default: () => 'D' } });
    await flush();
    const popup = screen.container.querySelector('.o-popup') as HTMLElement;
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.getAttribute('aria-modal')).toBe('true');
  });

  test('role="tooltip" - 弹层根设 role=tooltip 且无 aria-modal', async () => {
    const screen = render(OPopup, { props: { visible: true, wrapper: null, role: 'tooltip' }, slots: { default: () => 'T' } });
    await flush();
    const popup = screen.container.querySelector('.o-popup') as HTMLElement;
    expect(popup.getAttribute('role')).toBe('tooltip');
    expect(popup.getAttribute('aria-modal')).toBeNull();
  });

  test('未传 role - 弹层根无 role 属性', async () => {
    const screen = render(OPopup, { props: { visible: true, wrapper: null }, slots: { default: () => 'N' } });
    await flush();
    const popup = screen.container.querySelector('.o-popup') as HTMLElement;
    expect(popup.getAttribute('role')).toBeNull();
    expect(popup.getAttribute('aria-modal')).toBeNull();
  });
});
