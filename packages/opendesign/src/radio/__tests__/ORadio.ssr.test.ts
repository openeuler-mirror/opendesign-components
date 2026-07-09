/**
 * ORadio SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import ORadio from '../ORadio.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('ORadio SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ORadio, { value: 'a' }, 'Option')).resolves.toEqual(expect.any(String));
  });

  test('ORadio SSR defaultChecked=true - HTML 包含 o-radio-checked 类', async () => {
    const html = await renderSSR(ORadio, { value: 'a', defaultChecked: true }, 'A');
    expect(html).toMatch(/o-radio-checked/);
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

  test('ORadio hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORadio, { value: 'a' }, 'A');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ORadio hydration defaultChecked=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORadio, { value: 'a', defaultChecked: true }, 'C');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
