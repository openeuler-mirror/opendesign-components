/**
 * ODialog ARIA 无障碍契约测试。
 *
 * 验证浮层根 role='dialog' + aria-modal='true'，以及有 header 插槽时
 * aria-labelledby 关联弹窗标题 id，使读无障碍树的 AI 代理与屏幕阅读器
 * 能识别对话框及其标题。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import ODialog from '../ODialog.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const cleanup = () => {
  document.body.querySelectorAll(':scope > .o-layer').forEach((el) => el.remove());
};

describe('ARIA — 对话框', () => {
  afterEach(cleanup);

  test('浮层根设 role="dialog" 与 aria-modal="true"', async () => {
    const screen = render(ODialog, { props: { visible: true, wrapper: null }, slots: { default: () => 'D' } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('role')).toBe('dialog');
    expect(layer.getAttribute('aria-modal')).toBe('true');
  });

  test('有 header 插槽时 aria-labelledby 关联标题元素 id', async () => {
    const screen = render(ODialog, {
      props: { visible: true, wrapper: null },
      slots: { default: () => 'D', header: () => '标题' },
    });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    const header = screen.container.querySelector('.o-dlg-header') as HTMLElement;
    const labelledby = layer.getAttribute('aria-labelledby');
    expect(labelledby).not.toBeNull();
    expect(labelledby).toBe(header.getAttribute('id'));
  });

  test('无 header 插槽时不渲染 aria-labelledby', async () => {
    const screen = render(ODialog, { props: { visible: true, wrapper: null }, slots: { default: () => 'D' } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('aria-labelledby')).toBeNull();
  });
});
