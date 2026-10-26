/**
 * OSwitch SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OSwitch from '../OSwitch.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OSwitch SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OSwitch, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OSwitch SSR defaultChecked=true - HTML 包含 o-switch-checked 类', async () => {
    const html = await renderSSR(OSwitch, { defaultChecked: true }, '');
    expect(html).toMatch(/o-switch-checked/);
  });

  test('OSwitch SSR disabled=true - HTML 包含 o-switch-disabled 类', async () => {
    const html = await renderSSR(OSwitch, { disabled: true }, '');
    expect(html).toMatch(/o-switch-disabled/);
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

  test('OSwitch hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSwitch, {}, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSwitch hydration defaultChecked=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSwitch, { defaultChecked: true }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSwitch hydration loading=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSwitch, { loading: true }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
