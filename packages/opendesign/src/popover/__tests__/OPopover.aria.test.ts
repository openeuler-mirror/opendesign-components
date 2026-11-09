/**
 * OPopover ARIA 无障碍契约测试。
 *
 * 验证弹层根 role='tooltip'，使读无障碍树的 AI 代理与屏幕阅读器
 * 能识别其为提示气泡（tooltip）。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OPopover from '../OPopover.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const cleanup = () => {
  document.body.querySelectorAll('.o-popover').forEach((el) => el.remove());
};

describe('ARIA — 弹层根', () => {
  afterEach(cleanup);

  test('弹层根设 role="tooltip"', async () => {
    const screen = render(OPopover, { props: { visible: true, wrapper: null }, slots: { default: () => 'T' } });
    await flush();
    const popover = screen.container.querySelector('.o-popover') as HTMLElement;
    expect(popover.getAttribute('role')).toBe('tooltip');
  });
});
