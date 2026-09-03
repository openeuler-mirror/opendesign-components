import { test, expect, describe, afterEach } from 'vitest';
import ODialog from '../ODialog.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

/**
 * SSR 字符串渲染：调用 @vue/server-renderer 的 renderToString。
 *
 * ODialog 基于 OLayer（Teleport to="body"），SSR 端 teleport 内容不包含在
 * renderToString 返回值中，仅输出 teleport anchor 注释标记。
 * ODialog 默认 visible=false 且 unmountOnHide=true，SSR 无内容输出。
 */
describe('SSR 契约（字符串渲染）', () => {
  test('ODialog SSR visible=false - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ODialog, { visible: false }, 'Hidden')).resolves.toEqual(expect.any(String));
  });

  test('ODialog SSR visible=true - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ODialog, { visible: true }, 'Shown')).resolves.toEqual(expect.any(String));
  });

  test('ODialog SSR visible=true - HTML 输出包含 teleport anchor 标记', async () => {
    const html = await renderSSR(ODialog, { visible: true }, 'Content');
    expect(html).toContain('teleport start');
    expect(html).toContain('teleport end');
  });

  test('ODialog SSR visible=false unmountOnHide=true - 无内容输出', async () => {
    const html = await renderSSR(ODialog, { visible: false, unmountOnHide: true }, 'Empty');
    expect(html).not.toContain('o-dialog');
  });
});

/**
 * 客户端水合（hydration）安全性检测。
 *
 * ODialog 使用 Teleport to="body"，客户端 mount 时 teleport 激活
 * 会将内容移至 body，产生 hydration mismatch。
 * 用 test.fails 标记，待组件侧使用 ClientOnly 包裹后改回普通断言。
 */
describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test.fails('ODialog hydration visible=true - Teleport 导致水合 mismatch（已知问题）', async () => {
    const result = await ssrHydrateAndCompare(ODialog, { visible: true }, 'Hydrate');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test.fails('ODialog hydration visible=false - Teleport anchor 导致水合 mismatch（已知问题）', async () => {
    const result = await ssrHydrateAndCompare(ODialog, { visible: false }, 'Empty');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
