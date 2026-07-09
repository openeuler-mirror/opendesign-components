/**
 * OInput SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OInput from '../OInput.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OInput SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OInput, { placeholder: 'Enter' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OInput SSR modelValue - HTML 包含输入值', async () => {
    const html = await renderSSR(OInput, { modelValue: 'hello' }, '');
    expect(html).toContain('hello');
  });

  test('OInput SSR placeholder - HTML 包含 placeholder 属性', async () => {
    const html = await renderSSR(OInput, { placeholder: 'Type here' }, '');
    expect(html).toMatch(/placeholder="Type here"/);
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

  test('OInput hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OInput, { placeholder: 'Hi' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OInput hydration modelValue - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OInput, { modelValue: 'test' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
