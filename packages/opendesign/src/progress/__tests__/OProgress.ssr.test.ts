/**
 * OProgress SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OProgress from '../OProgress.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OProgress SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OProgress, { percentage: 50 }, '')).resolves.toEqual(expect.any(String));
  });

  test('OProgress SSR variant=circle - HTML 包含 svg', async () => {
    const html = await renderSSR(OProgress, { variant: 'circle', percentage: 75 }, '');
    expect(html).toContain('<svg');
  });

  test('OProgress SSR percentage=42 - HTML 包含 42% 文字', async () => {
    const html = await renderSSR(OProgress, { percentage: 42 }, '');
    expect(html).toContain('42%');
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

  test('OProgress hydration line - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OProgress, { percentage: 50, variant: 'line' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OProgress hydration circle - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OProgress, { percentage: 75, variant: 'circle' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
