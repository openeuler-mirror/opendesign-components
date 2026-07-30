/**
 * OCard SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OCard from '../OCard.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OCard SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OCard, { title: 'T' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OCard SSR href - HTML 输出 <a> 标签', async () => {
    const html = await renderSSR(OCard, { href: 'https://example.com' }, '');
    expect(html).toMatch(/<a[^>]*href="https:\/\/example\.com"/);
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

  test('OCard hydration title - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OCard, { title: 'Hello' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
