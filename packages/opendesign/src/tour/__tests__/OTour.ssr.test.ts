/**
 * OTour SSR 契约测试。
 *
 * OTour 模板用 <ClientOnly> 包裹 <Teleport>，服务端渲染时不输出 Tour 内容（ClientOnly
 * 在 SSR 下渲染 null），客户端 hydrate 同步阶段 isMounted 仍为 false → 与 SSR 一致无 mismatch，
 * 真正内容在 onMounted 异步延续中挂载。本文件验证：
 *   1. renderToString 不抛错且返回字符串
 *   2. 客户端水合无 mismatch（含带步骤子组件场景）
 */
import { test, expect, describe, afterEach } from 'vitest';
import { h } from 'vue';
import { OTour, OTourStep } from '../index';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const cleanup = () => {
  document.body.classList.remove('o-tour-open');
  document.body.querySelectorAll('.tour-test-wrapper, .tour-test-target, .o-tour').forEach((el) => el.remove());
};

describe('SSR 契约（字符串渲染）', () => {
  test('OTour SSR default - renderToString 返回字符串', async () => {
    await expect(renderSSR(OTour)).resolves.toEqual(expect.any(String));
  });

  test('OTour SSR visible=true - 不抛错（ClientOnly 下 SSR 仍为空字符串）', async () => {
    const html = await renderSSR(OTour, { visible: true });
    expect(typeof html).toBe('string');
  });

  test('OTour SSR mask=false - 不抛错', async () => {
    await expect(renderSSR(OTour, { mask: false })).resolves.toEqual(expect.any(String));
  });

  test('OTour SSR closeOnPressEscape=false - 不抛错', async () => {
    await expect(renderSSR(OTour, { closeOnPressEscape: false })).resolves.toEqual(expect.any(String));
  });

  test('OTour SSR 有 OTourStep 子组件 - renderToString 不抛错', async () => {
    const html = await renderSSR({
      render: () => h(OTour, { visible: true }, { default: () => h(OTourStep, { title: 'A' }) }),
    });
    expect(typeof html).toBe('string');
  });

  test('OTour SSR contentStyle - 不抛错', async () => {
    await expect(renderSSR(OTour, { contentStyle: { '--custom': '1px' } })).resolves.toEqual(expect.any(String));
  });
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
    cleanup();
  });

  test('OTour hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTour);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OTour hydration visible=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTour, { visible: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OTour hydration mask=false - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTour, { mask: false });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OTour hydration 有 OTourStep 子组件 - 无水合 mismatch', async () => {
    const Component = {
      render: () => h(OTour, { visible: true }, { default: () => h(OTourStep, { title: 'A' }) }),
    };
    const result = await ssrHydrateAndCompare(Component as any);
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
