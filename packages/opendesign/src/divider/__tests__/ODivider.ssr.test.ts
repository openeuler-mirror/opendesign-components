/**
 * ODivider SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import ODivider from '../ODivider.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('ODivider SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ODivider, {}, 'Label')).resolves.toEqual(expect.any(String));
  });

  test('ODivider SSR variant=dashed - HTML 包含 o-divider-dashed 类', async () => {
    const html = await renderSSR(ODivider, { variant: 'dashed' }, '');
    expect(html).toMatch(/o-divider-dashed/);
  });

  test('ODivider SSR direction=v - HTML 包含 o-divider-v 类', async () => {
    const html = await renderSSR(ODivider, { direction: 'v' }, '');
    expect(html).toMatch(/o-divider-v/);
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

  test('ODivider hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODivider, {}, 'Label');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ODivider hydration variant=dashed - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODivider, { variant: 'dashed' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
