/**
 * OAnchor SSR 契约测试。
 *
 * 验证：
 *   - renderToString 不抛错（含 default / layout=h / size=menu / 有 OAnchorItem 子组件）
 *   - 客户端水合无 mismatch（同上场景）
 *
 * SSR 安全性：OAnchor 在 onMounted 内才访问 window/document（getContainer、bindEvent、
 * useResizeObserver），SSR 阶段不执行 onMounted，模块顶层无浏览器 API 访问，渲染安全。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { h } from 'vue';
import OAnchor from '../OAnchor.vue';
import OAnchorItem from '../OAnchorItem.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OAnchor SSR default - renderToString 不抛出错误且含 o-anchor', async () => {
    const html = await renderSSR(OAnchor);
    expect(html).toContain('o-anchor');
  });

  test('OAnchor SSR layout=h - renderToString 不抛且含 o-anchor-h', async () => {
    const html = await renderSSR(OAnchor, { layout: 'h' });
    expect(html).toContain('o-anchor-h');
  });

  test('OAnchor SSR size=menu - renderToString 不抛且含 o-anchor-menu', async () => {
    const html = await renderSSR(OAnchor, { size: 'menu' });
    expect(html).toContain('o-anchor-menu');
  });

  test('OAnchor SSR 有 OAnchorItem - renderToString 不抛且含 link 与标题文本', async () => {
    const html = await renderSSR({
      render: () =>
        h(OAnchor, null, {
          default: () => h(OAnchorItem, { href: '#a', title: '锚点A' }),
        }),
    });
    expect(html).toContain('o-anchor-item-link');
    expect(html).toContain('锚点A');
    expect(html).toContain('href="#a"');
  });
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OAnchor hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OAnchor);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OAnchor hydration layout=h - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OAnchor, { layout: 'h' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OAnchor hydration size=menu - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OAnchor, { size: 'menu' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OAnchor hydration 有 OAnchorItem - 无水合 mismatch', async () => {
    const Component = {
      render: () =>
        h(OAnchor, null, {
          default: () => h(OAnchorItem, { href: '#a', title: '锚点A' }),
        }),
    };
    const result = await ssrHydrateAndCompare(Component as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
