/**
 * OBadge SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OBadge from '../OBadge.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OBadge SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OBadge, { value: '5' }, 'Box')).resolves.toEqual(expect.any(String));
  });

  test('OBadge SSR color=danger - HTML 包含 o-badge-danger 类', async () => {
    const html = await renderSSR(OBadge, { color: 'danger', value: '1' }, 'B');
    expect(html).toMatch(/o-badge-danger/);
  });

  test('OBadge SSR dot=true - HTML 包含 o-badge-dot 类', async () => {
    const html = await renderSSR(OBadge, { dot: true }, 'B');
    expect(html).toMatch(/o-badge-dot/);
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

  test('OBadge hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OBadge, { value: '5' }, 'Box');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OBadge hydration dot=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OBadge, { dot: true }, 'D');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
