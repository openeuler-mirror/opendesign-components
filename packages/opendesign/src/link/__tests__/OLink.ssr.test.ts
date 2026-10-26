/**
 * OLink SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { markRaw } from 'vue';
import OLink from '../OLink.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const OIconAdd = markRaw(OIconAddRaw);

describe('SSR 契约（字符串渲染）', () => {
  test('OLink SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLink, {}, 'Link')).resolves.toEqual(expect.any(String));
  });

  test('OLink SSR href - HTML 输出 <a> 标签', async () => {
    const html = await renderSSR(OLink, { href: 'https://example.com' }, 'Go');
    expect(html).toMatch(/<a[^>]*href="https:\/\/example\.com"/);
  });

  test('OLink SSR disabled - HTML 包含 o-link-disabled 类', async () => {
    const html = await renderSSR(OLink, { disabled: true }, 'D');
    expect(html).toMatch(/o-link-disabled/);
  });

  test('OLink SSR icon=OIconAdd - HTML 包含 svg 元素', async () => {
    const html = await renderSSR(OLink, { icon: OIconAdd }, 'X');
    expect(html).toContain('<svg');
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

  test('OLink hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLink, {}, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OLink hydration disabled - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLink, { disabled: true }, 'D');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OLink hydration icon - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLink, { icon: OIconAdd }, 'X');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
