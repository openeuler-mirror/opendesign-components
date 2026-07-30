/**
 * OTag SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OTag from '../OTag.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OTag SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OTag, {}, 'Tag')).resolves.toEqual(expect.any(String));
  });

  test('OTag SSR color=primary - HTML 包含 o-tag-primary 类', async () => {
    const html = await renderSSR(OTag, { color: 'primary' }, 'P');
    expect(html).toMatch(/o-tag-primary/);
  });

  test('OTag SSR closable=true - HTML 包含关闭按钮', async () => {
    const html = await renderSSR(OTag, { closable: true }, 'C');
    expect(html).toMatch(/o-tag-close/);
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

  test('OTag hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTag, {}, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OTag hydration closable=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTag, { closable: true }, 'C');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OTag hydration visible=false - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTag, { visible: false }, 'H');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
