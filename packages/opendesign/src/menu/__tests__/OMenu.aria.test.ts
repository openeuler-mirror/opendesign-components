/**
 * OMenu ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OMenu from '../OMenu.vue';
import OMenuItem from '../OMenuItem.vue';
import OSubMenu from '../OSubMenu.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 菜单', () => {
  test('根设 role="menu"，项设 role="menuitem" 并镜像 aria-current', async () => {
    const screen = render(OMenu, {
      props: { modelValue: 'a' },
      slots: { default: () => [h(OMenuItem, { value: 'a' }), h(OMenuItem, { value: 'b' })] },
    });
    await flush();
    const menu = screen.container.querySelector('.o-menu') as HTMLElement;
    expect(menu.getAttribute('role')).toBe('menu');
    const items = screen.container.querySelectorAll('.o-menu-item');
    expect(items[0].getAttribute('role')).toBe('menuitem');
    expect(items[0].getAttribute('aria-current')).toBe('page');
    expect(items[1].getAttribute('aria-current')).toBeNull();
  });
});

describe('ARIA — 子菜单', () => {
  test('子菜单标题设 aria-haspopup="menu"（弹出内容为菜单而非泛化值）', async () => {
    const screen = render(OMenu, {
      slots: {
        default: () =>
          h(
            OSubMenu,
            { label: 'Sub' },
            {
              default: () => h(OMenuItem, { value: 'a' }),
            },
          ),
      },
    });
    await flush();
    const title = screen.container.querySelector('.o-sub-menu-title') as HTMLElement;
    expect(title.getAttribute('role')).toBe('button');
    expect(title.getAttribute('aria-haspopup')).toBe('menu');
  });

  test('子菜单标题 aria-expanded 镜像展开态（收起 false → 点击展开 true）', async () => {
    const screen = render(OMenu, {
      slots: {
        default: () => h(OSubMenu, { value: 'sub', label: 'Sub' }, { default: () => h(OMenuItem, { value: 'a' }) }),
      },
    });
    await flush();
    const title = screen.container.querySelector('.o-sub-menu-title') as HTMLElement;
    expect(title.getAttribute('aria-expanded')).toBe('false');
    title.click();
    await flush();
    expect(title.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('ARIA — 菜单项禁用镜像', () => {
  test('菜单项 aria-disabled 镜像禁用态（disabled 项 true，可用项无属性）', async () => {
    const screen = render(OMenu, {
      slots: {
        default: () => [h(OMenuItem, { value: 'a', disabled: true }), h(OMenuItem, { value: 'b' })],
      },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-menu-item');
    expect(items[0].getAttribute('aria-disabled')).toBe('true');
    expect(items[1].getAttribute('aria-disabled')).toBeNull();
  });

  test('子菜单标题的 aria-controls 指向其菜单容器（APG menu 契约）', async () => {
    const screen = render(OMenu, {
      slots: {
        default: () => h(OSubMenu, { value: 'sub', label: 'Sub' }, { default: () => h(OMenuItem, { value: 'a' }) }),
      },
    });
    await flush();
    const title = screen.container.querySelector('.o-sub-menu-title') as HTMLElement;
    const children = screen.container.querySelector('.o-sub-menu-children') as HTMLElement;
    const controls = title.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(children.getAttribute('id')).toBe(controls);
    expect(children.getAttribute('role')).toBe('menu');
  });
});
