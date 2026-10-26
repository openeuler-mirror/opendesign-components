/**
 * OFigure SSR 契约测试。
 *
 * --------------------------------------------------------------------------
 * 两个 describe，对应 SSR 完整链路的前后两段：
 * --------------------------------------------------------------------------
 *
 * | describe           | 测什么                                          | 抓什么 bug                                                      |
 * | ------------------ | ----------------------------------------------- | --------------------------------------------------------------- |
 * | SSR 字符串渲染     | renderToString 不抛 + HTML 包含预期内容          | 服务端不兼容的 API、CSS 变量序列化、动态组件解析失败             |
 * | 客户端水合         | ssrHydrateAndCompare console.warn 检测无 mismatch | SSR 首帧与客户端 hydrate 时的虚拟 DOM 不一致                     |
 *
 * 选 prop 标准（改变 DOM 结构 / 内联 style / 切换底层元素的 prop）：
 *   - src（必传，影响 img 渲染）
 *   - ratio（内联 style --figure-padding-top）
 *   - fit（内联 style --figure-fit）
 *   - background（DOM 结构差异：无 img）
 *   - href（根元素 div → a 切换）
 *   - videoPoster（新增 .o-figure-mask + play-icon DOM）
 *   - preview（OLayer + Teleport，SSR 易错点）
 *   - colorful（内联 style --figure-prest-color）
 *   - lazy（img loading 属性差异）
 */
import { test, expect, describe, afterEach } from 'vitest';
import OFigure from '../OFigure.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const SRC = '/test-image.jpg';

describe('SSR 契约（字符串渲染）', () => {
  test('OFigure SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OFigure, { src: SRC })).resolves.toEqual(expect.any(String));
  });

  test('OFigure SSR src - HTML 输出包含 img 标签且 src 正确', async () => {
    const html = await renderSSR(OFigure, { src: SRC });
    expect(html).toMatch(/<img[^>]*src="\/test-image\.jpg"/);
  });

  test('OFigure SSR ratio - HTML 输出包含 --figure-padding-top 内联样式', async () => {
    const html = await renderSSR(OFigure, { src: SRC, ratio: 16 / 9 });
    expect(html).toMatch(/--figure-padding-top:\s*56\.25%/);
  });

  test('OFigure SSR fit - HTML 输出包含 --figure-fit 内联样式', async () => {
    const html = await renderSSR(OFigure, { src: SRC, fit: 'cover' });
    expect(html).toMatch(/--figure-fit:\s*cover/);
  });

  test('OFigure SSR background=true - HTML 不包含 img 标签', async () => {
    const html = await renderSSR(OFigure, { src: SRC, background: true, ratio: 16 / 9 });
    expect(html).not.toMatch(/<img/);
    expect(html).toMatch(/o-figure-bg/);
  });

  test('OFigure SSR href - HTML 根标签为 <a>', async () => {
    const html = await renderSSR(OFigure, { src: SRC, href: 'https://example.com' });
    expect(html.trimStart()).toMatch(/^<a\b/);
    expect(html).toMatch(/href="https:\/\/example\.com"/);
  });

  test('OFigure SSR videoPoster=true - HTML 包含 o-figure-video-poster 类', async () => {
    const html = await renderSSR(OFigure, { src: SRC, videoPoster: true });
    expect(html).toMatch(/o-figure-video-poster/);
    expect(html).toMatch(/o-figure-play-icon/);
  });

  test('OFigure SSR preview=true - HTML 包含 o-figure-preview-layer 类', async () => {
    const html = await renderSSR(OFigure, { src: SRC, preview: true });
    expect(html).toMatch(/o-figure-previewable/);
  });

  test('OFigure SSR lazy=true - HTML 包含 loading="lazy"', async () => {
    const html = await renderSSR(OFigure, { src: SRC, lazy: true });
    expect(html).toMatch(/loading="lazy"/);
  });

  test('OFigure SSR colorful=true - HTML 包含 is-colorful 类 + --figure-prest-color 样式', async () => {
    const html = await renderSSR(OFigure, { src: SRC, colorful: true });
    expect(html).toMatch(/is-colorful/);
    expect(html).toMatch(/--figure-prest-color:/);
  });
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
    // 清理 teleport 到 body 的 OLayer
    document.body.querySelectorAll('.o-layer').forEach((el) => el.remove());
  });

  test('OFigure hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration ratio=16/9 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, ratio: 16 / 9 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration fit=cover - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, fit: 'cover' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration background=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, background: true, ratio: 16 / 9 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration href=URL - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, href: 'https://example.com' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration videoPoster=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, videoPoster: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration lazy=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, lazy: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OFigure hydration colorful=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OFigure, { src: SRC, colorful: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
