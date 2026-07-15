/**
 * OSlider SSR 契约测试。
 *
 * 验证 defineSlots 重构后 SSR 字符串渲染 + 水合无 mismatch。
 */
import { test, expect, describe, afterEach } from 'vitest';
import OSlider from '../OSlider.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OSlider SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OSlider)).resolves.toEqual(expect.any(String));
  });

  test('OSlider SSR disabled=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OSlider, { disabled: true })).resolves.toEqual(expect.any(String));
  });

  test('OSlider SSR showInput=true - HTML 包含 o-slider-input-wrap', async () => {
    const html = await renderSSR(OSlider, { showInput: true });
    expect(html).toContain('o-slider-input-wrap');
  });

  test('OSlider SSR range=true - HTML 包含 o-slider 结构', async () => {
    const html = await renderSSR(OSlider, { range: true, modelValue: [20, 80] });
    expect(html).toContain('o-slider');
  });

  test('OSlider SSR direction=v - HTML 包含 o-slider-vertical 类', async () => {
    const html = await renderSSR(OSlider, { direction: 'v' });
    expect(html).toContain('o-slider-vertical');
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

  test('OSlider hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSlider);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSlider hydration disabled=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSlider, { disabled: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OSlider hydration showInput=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSlider, { showInput: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
