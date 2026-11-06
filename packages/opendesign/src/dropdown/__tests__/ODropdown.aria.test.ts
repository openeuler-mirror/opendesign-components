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
});
