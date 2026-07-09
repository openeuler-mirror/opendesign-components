/**
 * ORate SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import ORate from '../ORate.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('ORate SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ORate, { count: 5 }, '')).resolves.toEqual(expect.any(String));
  });

  test('ORate SSR defaultValue=3 - HTML 包含 3 个 full 状态', async () => {
    const html = await renderSSR(ORate, { defaultValue: 3 }, '');
    const fullMatches = html.match(/o-rate-item-status-full/g);
    expect(fullMatches?.length).toBe(3);
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

  test('ORate hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORate, { count: 5 }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
