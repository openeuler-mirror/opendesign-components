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

describe('ARIA — 测量镜像节点', () => {
  test('镜像节点省略 DOM id 且 aria-hidden，真实 nav 的 id 在文档中唯一', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const mirrors = screen.container.querySelectorAll('.o-tab-nav-list.width-measurement .o-tab-nav');
    // 测量镜像（v-show 隐藏、height:0）渲染全量页签，用于宽度测量
    expect(mirrors.length).toBe(2);
    mirrors.forEach((mirror) => {
      // 镜像节点不得携带 DOM id：与真实 nav 的 `${paneId}-nav` 重复属非法 HTML，
      // 且 pane 的 aria-labelledby 会解析到文档顺序靠前的隐藏镜像
      expect(mirror.getAttribute('id')).toBeNull();
      // 镜像节点必须对可访问性树隐藏：否则 tablist 内 tab 数量翻倍，读屏读到双份页签
      expect(mirror.getAttribute('aria-hidden')).toBe('true');
    });
    // 真实 nav 的 id 在整个文档中唯一
    const tabs = screen.container.querySelectorAll('.o-tab-nav-list:not(.width-measurement) .o-tab-nav[role="tab"]');
    tabs.forEach((tab) => {
      const navId = tab.getAttribute('id');
      expect(navId).toBeTruthy();
      expect(screen.container.querySelectorAll(`[id="${navId}"]`).length).toBe(1);
    });
  });
});

describe('ARIA — 用户自定义 pane id', () => {
  test('传入 id 时 pane / nav / aria 双向关联三侧同源', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: { default: () => h(OTabPane as any, { id: 'my-pane', value: '1', label: 'T1' }) },
    });
    await flush();
    const pane = screen.container.querySelector('.o-tab-pane[role="tabpanel"]') as HTMLElement;
    // pane 的 DOM id 采用用户传入值（不被内部 useId 值静默劫持）
    expect(pane.getAttribute('id')).toBe('my-pane');
    const nav = screen.container.querySelector('.o-tab-nav-list:not(.width-measurement) .o-tab-nav[role="tab"]') as HTMLElement;
    // nav 的 aria-controls 指向用户 id，与 pane 的 DOM id 同源
    expect(nav.getAttribute('aria-controls')).toBe('my-pane');
    // pane 的 aria-labelledby 指向派生的 nav id `${id}-nav`
    expect(pane.getAttribute('aria-labelledby')).toBe('my-pane-nav');
    const navEl = screen.container.querySelector('#my-pane-nav') as HTMLElement;
    expect(navEl).not.toBeNull();
    expect(navEl.getAttribute('role')).toBe('tab');
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

  test('未传 ariaLabel 时 tablist 回退 i18n 默认词条，显式传入时覆盖', async () => {
    const renderTab = (ariaLabel?: string) => {
      const screen = render(OTab, {
        props: { modelValue: '1', ...(ariaLabel ? { ariaLabel } : {}) },
        slots: { default: () => [h(OTabPane, { value: '1', label: 'T1' })] },
      });
      return screen;
    };
    // 未传：回退 i18n 默认名（tablist 不再是无名单选组）
    const bare = renderTab();
    await flush();
    const bareList = bare.container.querySelector('.o-tab-navs') as HTMLElement;
    expect(bareList.getAttribute('aria-label')).toBeTruthy();
    // 显式传入：覆盖
    const explicit = renderTab('视图切换');
    await flush();
    const explicitList = explicit.container.querySelector('.o-tab-navs') as HTMLElement;
    expect(explicitList.getAttribute('aria-label')).toBe('视图切换');
  });
});
