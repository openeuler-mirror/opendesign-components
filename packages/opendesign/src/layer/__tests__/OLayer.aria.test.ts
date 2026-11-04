/**
 * OLayer ARIA 无障碍契约测试。
 *
 * 验证浮层根 role='dialog' + aria-modal='true'，使读无障碍树的 AI 代理
 * 与屏幕阅读器能识别其为模态对话框。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OLayer from '../OLayer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const cleanup = () => {
  document.body.querySelectorAll(':scope > .o-layer').forEach((el) => el.remove());
};

describe('ARIA — 浮层根', () => {
  afterEach(cleanup);

  test('浮层根设 role="dialog"', async () => {
    const screen = render(OLayer, { props: { visible: true, wrapper: null } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('role')).toBe('dialog');
  });

  test('浮层根设 aria-modal="true"', async () => {
    const screen = render(OLayer, { props: { visible: true, wrapper: null } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('aria-modal')).toBe('true');
  });
});
