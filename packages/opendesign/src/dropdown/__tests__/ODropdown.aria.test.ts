/**
 * ODropdown ARIA 无障碍契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import ODropdown from '../ODropdown.vue';
import ODropdownItem from '../ODropdownItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const cleanup = () => {
  document.body.querySelectorAll('.o-dropdown-list').forEach((el) => el.remove());
};

describe('ARIA — 下拉菜单', () => {
  afterEach(cleanup);

  test('列表设 role="menu"，项设 role="menuitem"', async () => {
    const screen = render(ODropdown, {
      props: { visible: true, optionsWrapper: null },
      slots: {
        default: () => 'Trigger',
        dropdown: () => h(ODropdownItem, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const list = document.querySelector('.o-dropdown-list') as HTMLElement;
    expect(list).not.toBeNull();
    expect(list.getAttribute('role')).toBe('menu');
    const item = document.querySelector('.o-dropdown-item') as HTMLElement;
    expect(item.getAttribute('role')).toBe('menuitem');
  });

  test('disabled 项设 aria-disabled="true"', async () => {
    const screen = render(ODropdown, {
      props: { visible: true, optionsWrapper: null },
      slots: {
        default: () => 'Trigger',
        dropdown: () => h(ODropdownItem, { value: 'a', label: 'A', disabled: true }),
      },
    });
    await flush();
    const item = document.querySelector('.o-dropdown-item') as HTMLElement;
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });

  test('触发器镜像 aria-haspopup="menu" 与 aria-expanded，菜单经 aria-labelledby 回指触发器', async () => {
    const screen = render(ODropdown, {
      // 可访问名称走 attrs 透传，组件不额外声明 ariaLabel prop
      attrs: { 'aria-label': '更多操作' },
      props: { visible: true, optionsWrapper: null },
      slots: {
        default: () => 'Trigger',
        dropdown: () => h(ODropdownItem, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const trigger = screen.container.querySelector('.o-dropdown') as HTMLElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-label')).toBe('更多操作');
    // 菜单回指触发器：弹出菜单不再是无名菜单孤岛
    const list = document.querySelector('.o-dropdown-list') as HTMLElement;
    const labelledBy = list.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(trigger.getAttribute('id')).toBe(labelledBy);
  });

  test('收起态触发器输出 aria-expanded="false"', async () => {
    const screen = render(ODropdown, {
      props: { defaultVisible: false, optionsWrapper: null },
      slots: { default: () => 'Trigger', dropdown: () => h(ODropdownItem, { value: 'a', label: 'A' }) },
    });
    await flush();
    const trigger = screen.container.querySelector('.o-dropdown') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  test('trigger="none"（受控模式：开合由外部 visible 控制）仍声明 menu 语义并镜像受控展开态', async () => {
    const screen = render(ODropdown, {
      // none 表示组件不自行响应触发事件，菜单依旧会由外部 visible 打开，故 aria 语义必须保留
      props: { trigger: 'none', visible: false, optionsWrapper: null },
      slots: { default: () => 'Trigger', dropdown: () => h(ODropdownItem, { value: 'a', label: 'A' }) },
    });
    await flush();
    const trigger = screen.container.querySelector('.o-dropdown') as HTMLElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  test('消费方透传 id 时，触发器 DOM id 与菜单 aria-labelledby 同源', async () => {
    const screen = render(ODropdown, {
      attrs: { id: 'my-dropdown' },
      props: { visible: true, optionsWrapper: null },
      slots: { default: () => 'Trigger', dropdown: () => h(ODropdownItem, { value: 'a', label: 'A' }) },
    });
    await flush();
    const trigger = screen.container.querySelector('.o-dropdown') as HTMLElement;
    const list = document.querySelector('.o-dropdown-list') as HTMLElement;
    expect(trigger.getAttribute('id')).toBe('my-dropdown');
    expect(list.getAttribute('aria-labelledby')).toBe('my-dropdown');
    expect(document.getElementById('my-dropdown')).toBe(trigger);
  });
});
