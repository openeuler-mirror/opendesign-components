/**
 * OLayer ARIA 无障碍契约测试。
 *
 * opt-in role 契约：仅当显式传入 role prop 时浮层根才渲染对应 role，
 * `dialog` 时附带 aria-modal="true"，未传时不渲染任何 role 属性——
 * OLayer 是 OLoading / OFigure / OImageViewer 等非对话框浮层的公共底座，
 * 无条件设置 role="dialog" 会把它们错误地标为模态对话框（与 OPopup 的
 * opt-in role prop 设计保持一致）。
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

  test('未传 role - 浮层根无 role 属性（不污染非对话框消费方）', async () => {
    const screen = render(OLayer, { props: { visible: true, wrapper: null }, slots: { default: () => 'L' } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('role')).toBeNull();
    expect(layer.getAttribute('aria-modal')).toBeNull();
  });

  test('role="dialog" - 浮层根设 role=dialog 且 aria-modal=true', async () => {
    const screen = render(OLayer, { props: { visible: true, wrapper: null, role: 'dialog' }, slots: { default: () => 'D' } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('role')).toBe('dialog');
    expect(layer.getAttribute('aria-modal')).toBe('true');
  });

  test('role="tooltip" - 浮层根设 role=tooltip 且无 aria-modal', async () => {
    const screen = render(OLayer, { props: { visible: true, wrapper: null, role: 'tooltip' }, slots: { default: () => 'T' } });
    await flush();
    const layer = screen.container.querySelector('.o-layer') as HTMLElement;
    expect(layer.getAttribute('role')).toBe('tooltip');
    expect(layer.getAttribute('aria-modal')).toBeNull();
  });
});
