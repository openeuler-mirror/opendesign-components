/**
 * OBreadcrumb ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OBreadcrumb from '../OBreadcrumb.vue';
import OBreadcrumbItem from '../OBreadcrumbItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 面包屑', () => {
  test('根元素设 role="navigation" 与默认 aria-label', async () => {
    const screen = render(OBreadcrumb, {
      slots: { default: () => h(OBreadcrumbItem, {}, () => 'Home') },
    });
    await flush();
    const nav = screen.container.querySelector('.o-breadcrumb') as HTMLElement;
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBeTruthy();
  });

  test('末级项（无 to/href）设 aria-current="page"，链接项无该属性', async () => {
    const screen = render(OBreadcrumb, {
      slots: {
        default: () => [
          h(OBreadcrumbItem as any, { href: '/home' }, () => '首页'),
          h(OBreadcrumbItem as any, { href: '/list' }, () => '列表'),
          // 当前页：纯文本项
          h(OBreadcrumbItem as any, {}, () => '详情'),
        ],
      },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-breadcrumb-item');
    expect(items.length).toBe(3);
    // 唯一携带 aria-current 的项是末级纯文本项
    const currents = screen.container.querySelectorAll('[aria-current="page"]');
    expect(currents.length).toBe(1);
    expect(currents[0].textContent?.trim()).toBe('详情');
    // 链接项不携带该属性
    expect(items[0].getAttribute('aria-current')).toBeNull();
    expect(items[1].getAttribute('aria-current')).toBeNull();
  });

  test('ariaLabel 显式传入时覆盖默认词条', async () => {
    const screen = render(OBreadcrumb, {
      props: { ariaLabel: '文档路径' },
      slots: { default: () => h(OBreadcrumbItem, {}, () => 'Home') },
    });
    await flush();
    const nav = screen.container.querySelector('.o-breadcrumb') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('文档路径');
  });
});
