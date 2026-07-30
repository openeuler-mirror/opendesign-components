/**
 * OToggle SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OToggle from '../OToggle.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OToggle SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OToggle, {}, 'Toggle')).resolves.toEqual(expect.any(String));
  });

  test('OToggle SSR defaultChecked=true - HTML 包含 o-toggle-checked 类', async () => {
    const html = await renderSSR(OToggle, { defaultChecked: true }, 'T');
    expect(html).toMatch(/o-toggle-checked/);
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

  test('OToggle hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OToggle, {}, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OToggle hydration defaultChecked=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OToggle, { defaultChecked: true }, 'C');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
