/**
 * OLayer SSR 契约测试。
 *
 * 验证 SSR 字符串渲染不抛错 + 客户端水合无 mismatch。
 *
 * 注意：OLayer 默认 visible=false 时 isMounted=false（v-if 阻断），
 *       SSR 输出仅含 Teleport 标记，无实际浮层内容。
 *       不测试 visible=true 的 SSR，因为 createTopZIndex() 全局计数器
 *       在 SSR 与客户端两阶段递增，会导致 --layer-z-index mismatch。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OLayer from '../OLayer.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OLayer SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLayer, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OLayer SSR wrapper=null - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLayer, { wrapper: null }, '')).resolves.toEqual(expect.any(String));
  });

  test('OLayer SSR mask=false - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLayer, { mask: false }, '')).resolves.toEqual(expect.any(String));
  });

  test('OLayer SSR buttonClose=true - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLayer, { buttonClose: true }, '')).resolves.toEqual(expect.any(String));
  });

  test('OLayer SSR unmountOnHide=false - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OLayer, { unmountOnHide: false }, '')).resolves.toEqual(expect.any(String));
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

  test('OLayer hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLayer, {}, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OLayer hydration wrapper=null - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLayer, { wrapper: null }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OLayer hydration mask=false - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OLayer, { mask: false }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
