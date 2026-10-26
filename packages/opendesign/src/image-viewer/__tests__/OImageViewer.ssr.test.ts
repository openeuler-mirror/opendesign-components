/**
 * OImageViewer SSR 契约测试。
 *
 * 验证：
 *   1. renderToString 不抛出错误
 *   2. 客户端水合无 mismatch
 *
 * @description OImageViewer 内部持有 OLayer，OLayer 使用 <teleport> 将内容渲染到目标节点。
 * Vue 3.5 的 renderToString 不将 teleport 内容包含在输出字符串中（teleport 内容
 * 渲染到独立 buffer），因此 SSR HTML 不包含组件内部结构，仅验证不抛错 + 水合无 mismatch。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OImageViewer from '../OImageViewer.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const MOCK_IMG_A = 'https://example.com/a.png';
const MOCK_IMG_B = 'https://example.com/b.png';

describe('SSR 契约（字符串渲染）', () => {
  test('OImageViewer SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OImageViewer, { previewList: [MOCK_IMG_A] }, '')).resolves.toEqual(expect.any(String));
  });

  test('OImageViewer SSR 多图 - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OImageViewer, { previewList: [MOCK_IMG_A, MOCK_IMG_B] }, '')).resolves.toEqual(expect.any(String));
  });

  test('OImageViewer SSR toolbar=false - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OImageViewer, { previewList: [MOCK_IMG_A], toolbar: false }, '')).resolves.toEqual(expect.any(String));
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

  test('OImageViewer hydration 单图 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OImageViewer, { previewList: [MOCK_IMG_A] }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OImageViewer hydration 多图 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OImageViewer, { previewList: [MOCK_IMG_A, MOCK_IMG_B] }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OImageViewer hydration toolbar=false - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OImageViewer, { previewList: [MOCK_IMG_A], toolbar: false }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
