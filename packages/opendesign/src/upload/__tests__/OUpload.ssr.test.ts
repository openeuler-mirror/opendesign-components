/**
 * OUpload SSR 契约测试。
 *
 * 验证 defineSlots 重构后 SSR 字符串渲染 + 水合无 mismatch。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OUpload from '../OUpload.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OUpload SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OUpload)).resolves.toEqual(expect.any(String));
  });

  test('OUpload SSR disabled=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OUpload, { disabled: true })).resolves.toEqual(expect.any(String));
  });

  test('OUpload SSR listType=picture-card - HTML 包含 o-upload-card-list', async () => {
    const html = await renderSSR(OUpload, { listType: 'picture-card' });
    expect(html).toContain('o-upload-card-list');
  });

  test('OUpload SSR draggable=true - HTML 包含 o-upload-draggable 类', async () => {
    const html = await renderSSR(OUpload, { draggable: true });
    expect(html).toContain('o-upload-draggable');
  });

  test('OUpload SSR btnLabel - HTML 包含按钮文本', async () => {
    const html = await renderSSR(OUpload, { btnLabel: '上传' });
    expect(html).toContain('上传');
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

  test('OUpload hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OUpload);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OUpload hydration disabled=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OUpload, { disabled: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OUpload hydration listType=picture-card - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OUpload, { listType: 'picture-card' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
