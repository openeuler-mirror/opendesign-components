/**
 * OAvatar SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OAvatar from '../OAvatar.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OAvatar SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OAvatar, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OAvatar SSR name - HTML 包含首字符', async () => {
    const html = await renderSSR(OAvatar, { name: 'John' }, '');
    expect(html).toContain('J');
  });

  test('OAvatar SSR url - HTML 包含 img 标签', async () => {
    const html = await renderSSR(OAvatar, { url: 'https://example.com/a.png' }, '');
    expect(html).toMatch(/<img[^>]*src="https:\/\/example\.com\/a\.png"/);
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

  test('OAvatar hydration name - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OAvatar, { name: 'Test' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
