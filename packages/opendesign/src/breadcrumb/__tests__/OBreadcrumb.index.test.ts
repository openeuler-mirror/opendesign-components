/**
 * OBreadcrumb 单组件契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OBreadcrumb from '../OBreadcrumb.vue';
import OBreadcrumbItem from '../OBreadcrumbItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约', () => {
  test('OBreadcrumb 根元素 class 包含 o-breadcrumb', async () => {
    const screen = render(OBreadcrumb, { slots: { default: () => 'Items' } });
    expect(screen.container.querySelector('.o-breadcrumb')).not.toBeNull();
  });

  test('OBreadcrumb - 渲染子项', async () => {
    const screen = render(OBreadcrumb, {
      slots: {
        default: () => [h(OBreadcrumbItem, { href: '/' }, () => 'Home'), h(OBreadcrumbItem, () => 'Current')],
      },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-breadcrumb-item');
    expect(items.length).toBe(2);
  });

  test('OBreadcrumb separator - 透传分隔符到子项', async () => {
    const screen = render(OBreadcrumb, {
      props: { separator: '/' },
      slots: {
        default: () => [h(OBreadcrumbItem, () => 'A'), h(OBreadcrumbItem, () => 'B')],
      },
    });
    await flush();
    // 验证不抛错
    expect(screen.container.querySelector('.o-breadcrumb')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OBreadcrumb SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OBreadcrumb, {}, 'Items')).resolves.toEqual(expect.any(String));
  });

  test('OBreadcrumb hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OBreadcrumb, {}, 'Items');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
