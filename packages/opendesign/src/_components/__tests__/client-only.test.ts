/**
 * _components/client-only.ts ClientOnly 组件测试。
 *
 * 验证 ClientOnly 在 mounted 前不渲染内容，mounted 后渲染插槽内容。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import ClientOnly from '../client-only';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('ClientOnly', () => {
  test('ClientOnly - mounted 后渲染插槽内容', async () => {
    const screen = render(ClientOnly, {
      slots: { default: () => h('div', { class: 'content' }, 'Hello') },
    });
    await flush();
    const content = screen.container.querySelector('.content');
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe('Hello');
  });

  test('ClientOnly - mounted 前不渲染任何内容（SSR 时输出不含 slot）', async () => {
    const html = await renderSSR(ClientOnly, {}, 'SSR Content');
    // SSR 时 ClientOnly 不渲染 default slot（isMoutned 初始为 false）
    expect(html).not.toContain('SSR Content');
  });

  test('ClientOnly - 无插槽时渲染 null（无子元素）', async () => {
    const screen = render(ClientOnly, {});
    await flush();
    // 无插槽时 slots.default 为 undefined，渲染 null/注释
    expect(screen.container.children.length).toBe(0);
  });

  test('ClientOnly SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ClientOnly, {}, 'X')).resolves.toEqual(expect.any(String));
  });

  test('ClientOnly hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ClientOnly, {}, 'X');
    // ClientOnly 在 SSR 时渲染 null/注释，hydrate 时也渲染 null（onMounted 未执行）
    // 首次 hydrate 应无 mismatch
    expect(result.hasMismatch).toBe(false);
    if (result.root) {
      result.root.remove();
    }
  });
});
