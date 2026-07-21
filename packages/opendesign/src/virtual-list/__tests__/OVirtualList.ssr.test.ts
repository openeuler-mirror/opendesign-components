/**
 * OVirtualList SSR 兼容性测试。
 *
 * 抓的问题：
 *   - 模块顶层或 setup 同步段访问 window/document/ResizeObserver 等浏览器 API（会让 renderToString 报错）
 *   - props 默认值依赖运行时环境
 *   - hydration 时 SSR 首帧 HTML 与客户端虚拟 DOM 不一致
 *
 * 抓不到的：像素级渲染差异、:hover/:active 视觉切换、滚动行为、v-html 内容不同但文本相同。
 *
 * 注：OVirtualList 依赖 ResizeObserver（v-on-resize 指令）和自定义滚动条指令（v-scrollbar），
 * 这些在 SSR 环境下无法执行，但组件模板本身仍应能正常序列化为 HTML。
 *
 * 不归属本文件的维度：
 *   - 组件渲染 / DOM → OVirtualList.index.test.ts
 *   - 响应式 → OVirtualList.responsive.test.ts
 *   - 纯函数工具 → 源码同级 .test.ts（utils/、composables/）
 */
import { afterEach, describe, expect, test } from 'vitest';
import OVirtualList from '../OVirtualList.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

// ============================================================================
// 测试数据
// ============================================================================

const smallList = new Array(5).fill(1).map((_, idx) => ({
  label: `Item-${idx + 1}`,
}));

const dynamicList = new Array(5).fill(1).map((_, idx) => ({
  id: `dyn-${idx + 1}`,
  label: `DynItem-${idx + 1}`,
}));

// ============================================================================
// SSR 契约（字符串渲染）
// ============================================================================
describe('SSR 契约（字符串渲染）', () => {
  test('OVirtualList SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80 })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR list - HTML 输出包含列表项文案', async () => {
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: 80 }, 'Item-');
    // SSR 应至少渲染部分项的内容
    expect(html).toContain('Item-');
  });

  test('OVirtualList SSR DOM结构 - HTML 输出包含关键容器类名', async () => {
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: 80 });
    expect(html).toMatch(/o-virtual-list/);
    expect(html).toMatch(/o-virtual-list-wrapper/);
    expect(html).toMatch(/o-virtual-body/);
  });

  test('OVirtualList SSR itemSize=80 - HTML 输出包含 height:80px 内联样式', async () => {
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: 80 });
    expect(html).toMatch(/height:\s*80px/);
  });

  test('OVirtualList SSR defaultItemSize=50 - 不定高模式 content-height 以 50 为基准', async () => {
    const html = await renderSSR(OVirtualList, { list: dynamicList, defaultItemSize: 50 });
    // 5 × 50 = 250
    expect(html).toMatch(/--_vl-content-height:\s*250px/);
  });

  test('OVirtualList SSR defaultStartIndex=2 - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, defaultStartIndex: 2 })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR scrollbar=false - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, scrollbar: false })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR buffer=3 - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, buffer: 3 })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR list=[] - 空列表不崩溃，渲染空容器', async () => {
    // 空 list 时 content-height 为 0，但不应抛错
    await expect(renderSSR(OVirtualList, { list: [], itemSize: 80 })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR layout=horizontal - 水平布局不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, layout: 'horizontal' })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR layout=horizontal - HTML 输出包含 o-horizontal 类名', async () => {
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: 80, layout: 'horizontal' });
    expect(html).toMatch(/o-horizontal/);
  });

  test('OVirtualList SSR layout=horizontal - 使用 --_vl-content-width 而非 --_vl-content-height', async () => {
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: 80, layout: 'horizontal' });
    // 水平模式应输出 --_vl-content-width CSS 变量
    expect(html).toMatch(/--_vl-content-width/);
  });

  test('OVirtualList SSR layout=horizontal + itemSize=Function - 不影响 renderToString', async () => {
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: sizeFn, layout: 'horizontal' })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR layout=horizontal + 不定宽 - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: dynamicList, defaultItemSize: 80, layout: 'horizontal' })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR layout=horizontal + 不定宽 - HTML 包含 --_vl-content-width', async () => {
    const html = await renderSSR(OVirtualList, { list: dynamicList, defaultItemSize: 80, layout: 'horizontal' });
    expect(html).toMatch(/--_vl-content-width/);
  });

  test('OVirtualList SSR threshold=null - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, threshold: null })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR threshold=50 - 不影响 renderToString', async () => {
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: 80, threshold: 50 })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR itemSize=Function - 按项定高模式不影响 renderToString', async () => {
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    await expect(renderSSR(OVirtualList, { list: smallList, itemSize: sizeFn })).resolves.toEqual(expect.any(String));
  });

  test('OVirtualList SSR itemSize=Function - HTML 输出包含按函数计算的 height', async () => {
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const html = await renderSSR(OVirtualList, { list: smallList, itemSize: sizeFn });
    // 第一项 height: sizeFn(item0, 0) = 40px
    expect(html).toMatch(/height:\s*40px/);
  });
});

/**
 * 客户端水合（hydration）安全性检测：console.warn 为主。
 *
 * 通过 ssrHydrateAndCompare 拦截 Vue hydration 过程中的 console.warn 警告，
 * 检测是否存在水合 mismatch。textContent 对比和 Element 引用对比作为诊断字段保留。
 *
 * console.warn 覆盖的 mismatch 类型：
 *   - 文本值不同、节点类型不同、子节点数量不同
 *   - 非法 HTML 嵌套、Teleport 移出 root
 *   - class/style/属性 mismatch（check-only，Vue 只 warn 不 patch DOM）
 *
 * 不可突破的盲区：v-html 内容不同但文本相同（Vue 不 patch、不 warn、不替换 Element）。
 *
 * Browser Mode 环境共享限制：SSR 和客户端在同一浏览器上下文，
 * typeof window / window.innerWidth / navigator.userAgent 等两端一致，
 * 无法测试真实 Node.js SSR 与客户端环境差异。
 */
describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OVirtualList hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration scrollbar=false - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80, scrollbar: false });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration buffer=3 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80, buffer: 3 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration defaultStartIndex=2 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80, defaultStartIndex: 2 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  // OVirtualList 使用 ResizeObserver（v-on-resize）和 v-scrollbar 指令，
  // 这些在 SSR 不执行但在客户端 hydrate 时触发。console.warn 检测仅比对
  // hydrate 同步阶段的虚拟 DOM 与 SSR HTML，onMounted 后的更新不算 mismatch。
  test('OVirtualList hydration 不定高模式 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: dynamicList, defaultItemSize: 80 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration list=[] - 空列表无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: [], itemSize: 80 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration layout=horizontal - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80, layout: 'horizontal' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration threshold=50 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: 80, threshold: 50 });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration itemSize=Function - 无水合 mismatch', async () => {
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: sizeFn });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration layout=horizontal + itemSize=Function - 无水合 mismatch', async () => {
    const sizeFn = (_item: unknown, index: number) => 40 + index * 10;
    const result = await ssrHydrateAndCompare(OVirtualList, { list: smallList, itemSize: sizeFn, layout: 'horizontal' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OVirtualList hydration layout=horizontal + 不定宽 - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OVirtualList, { list: dynamicList, defaultItemSize: 80, layout: 'horizontal' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
