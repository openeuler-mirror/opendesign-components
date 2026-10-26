/**
 * OSkeleton 单组件契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSkeleton from '../OSkeleton.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OSkeleton loading=true - 渲染骨架屏', async () => {
    const screen = render(OSkeleton, {});
    await flush();
    expect(screen.container.querySelector('.o-skeleton')).not.toBeNull();
  });

  test('OSkeleton loading=false - 渲染 slot 内容', async () => {
    const screen = render(OSkeleton, {
      props: { loading: false },
      slots: { default: () => h('div', { class: 'content' }, 'Real Content') },
    });
    await flush();
    expect(screen.container.querySelector('.o-skeleton')).toBeNull();
    expect(screen.container.querySelector('.content')?.textContent).toBe('Real Content');
  });

  test('OSkeleton animation - 注入 o-skeleton-animation 类', async () => {
    const screen = render(OSkeleton, { props: { animation: true } });
    await flush();
    expect((screen.container.querySelector('.o-skeleton') as HTMLElement).classList.contains('o-skeleton-animation')).toBe(true);
  });

  test('OSkeleton rows - 传递给 OSkeletonText', async () => {
    const screen = render(OSkeleton, { props: { rows: 5 } });
    await flush();
    const texts = screen.container.querySelectorAll('.o-skeleton-text');
    expect(texts.length).toBeGreaterThan(0);
  });

  test('OSkeleton slot=template - 替换骨架屏模板', async () => {
    const screen = render(OSkeleton, {
      slots: { template: () => h('div', { class: 'custom-skeleton' }, 'S') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-skeleton')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OSkeleton SSR loading=true - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OSkeleton, { loading: true }, '')).resolves.toEqual(expect.any(String));
  });

  test('OSkeleton SSR loading=false - HTML 包含 slot 内容', async () => {
    const html = await renderSSR(OSkeleton, { loading: false }, 'Real');
    expect(html).toContain('Real');
  });

  test('OSkeleton hydration loading=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OSkeleton, { loading: true }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
