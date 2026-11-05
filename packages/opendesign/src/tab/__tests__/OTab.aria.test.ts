/**
 * OTab ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OTab from '../OTab.vue';
import OTabPane from '../OTabPane.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 页签', () => {
  test('navs 设 role="tablist"，nav 项设 role="tab" 并镜像 aria-selected', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const tablist = screen.container.querySelector('.o-tab-navs') as HTMLElement;
    expect(tablist.getAttribute('role')).toBe('tablist');
    const tabs = screen.container.querySelectorAll('.o-tab-nav-list:not(.width-measurement) .o-tab-nav[role="tab"]');
    expect(tabs.length).toBe(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  test('pane 设 role="tabpanel"', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T1' }) },
    });
    await flush();
    const pane = screen.container.querySelector('.o-tab-pane') as HTMLElement;
    expect(pane.getAttribute('role')).toBe('tabpanel');
  });

  test('disabled 页签的 nav 镜像 aria-disabled="true"，可用页签无该属性', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane as any, { value: '1', label: 'T1' }), h(OTabPane as any, { value: '2', label: 'T2', disabled: true })],
      },
    });
    await flush();
    const tabs = screen.container.querySelectorAll('.o-tab-nav-list:not(.width-measurement) .o-tab-nav[role="tab"]');
    expect(tabs[1].getAttribute('aria-disabled')).toBe('true');
    expect(tabs[0].getAttribute('aria-disabled')).toBeNull();
  });
});

describe('ARIA — tab 与 panel 双向关联', () => {
  test('nav 的 aria-controls 指向对应 pane 的 DOM id', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const tabs = screen.container.querySelectorAll('.o-tab-nav-list:not(.width-measurement) .o-tab-nav[role="tab"]');
    tabs.forEach((tab) => {
      const controlsId = tab.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      // aria-controls 指向的 pane 应真实存在（且激活 pane 已挂载）
      expect(screen.container.querySelector(`#${controlsId}`)).not.toBeNull();
    });
  });

  test('pane 的 aria-labelledby 指向对应 nav 的 DOM id', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' })],
      },
    });
    await flush();
    const pane = screen.container.querySelector('.o-tab-pane[role="tabpanel"]') as HTMLElement;
    const labelledBy = pane.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const nav = screen.container.querySelector(`#${labelledBy}`);
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute('role')).toBe('tab');
  });
});
