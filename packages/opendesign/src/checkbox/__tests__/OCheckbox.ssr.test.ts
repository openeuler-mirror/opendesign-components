/**
 * OCheckbox SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OCheckbox from '../OCheckbox.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OCheckbox SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OCheckbox, { value: 'a' }, 'Option')).resolves.toEqual(expect.any(String));
  });

  test('OCheckbox SSR defaultChecked=true - HTML 包含 o-checkbox-checked 类', async () => {
    const html = await renderSSR(OCheckbox, { value: 'a', defaultChecked: true }, 'A');
    expect(html).toMatch(/o-checkbox-checked/);
  });

  test('OCheckbox SSR disabled=true - HTML 包含 o-checkbox-disabled 类', async () => {
    const html = await renderSSR(OCheckbox, { value: 'a', disabled: true }, 'D');
    expect(html).toMatch(/o-checkbox-disabled/);
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

  test('OCheckbox hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OCheckbox, { value: 'a' }, 'A');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OCheckbox hydration defaultChecked=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OCheckbox, { value: 'a', defaultChecked: true }, 'C');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
