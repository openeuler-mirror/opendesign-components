/**
 * OCollapse SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { h } from 'vue';
import OCollapse from '../OCollapse.vue';
import OCollapseItem from '../OCollapseItem.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OCollapse SSR default - renderToString 不抛出错误', async () => {
    const html = await renderSSR(OCollapse, {}, '');
    expect(html).toContain('o-collapse');
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

  test('OCollapse hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OCollapse, {}, 'Content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
