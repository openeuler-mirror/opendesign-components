/**
 * ODataTable SSR 兼容性测试。
 *
 * 抓的问题：
 *   - 模块顶层或 setup 同步段访问 window/document/ResizeObserver 等浏览器 API（会让 renderToString 报错）
 *   - props 默认值依赖运行时环境
 *   - hydration mismatch（console.warn 为主检测，textContent / Element 引用为诊断字段）
 *
 * console.warn 覆盖的 mismatch 类型：
 *   - 文本值不同（随机值/时间戳）、节点类型不同、子节点数量不同
 *   - class/style/属性 mismatch（check-only，Vue 只 warn 不 patch DOM）
 *   - 非法 HTML 嵌套被浏览器修正、Teleport 移出 root
 *
 * 唯一盲区：v-html 内容不同但文本相同。
 *
 * 抓不到的：像素级渲染差异、:hover/:active 视觉切换、真实 SSR（Node.js）环境差异。
 */
import { test, expect, describe, afterEach } from 'vitest';
import ODataTable from '../ODataTable.vue';
import type { DataTableColumnT } from '../types';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
];

const data = [
  { id: 'r1', name: 'Alice', age: 20 },
  { id: 'r2', name: 'Bob', age: 22 },
];

describe('SSR 契约（字符串渲染）', () => {
  test('ODataTable SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ODataTable, { data, columns })).resolves.toEqual(expect.any(String));
  });

  test('ODataTable SSR data+columns - HTML 输出包含表头文案与数据', async () => {
    const html = await renderSSR(ODataTable, { data, columns });
    expect(html).toContain('Name');
    expect(html).toContain('Age');
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
  });

  test('ODataTable SSR size=small - HTML 输出包含 o-table-small 类', async () => {
    const html = await renderSSR(ODataTable, { data, columns, size: 'small' });
    expect(html).toMatch(/class="[^"]*o-table-small/);
  });

  test('ODataTable SSR headerStyle=split-line - HTML 输出包含 split-line 类与分隔条', async () => {
    const html = await renderSSR(ODataTable, { data, columns, headerStyle: 'split-line' });
    expect(html).toMatch(/o-table-header-split-line/);
    expect(html).toContain('o-data-table-header-divider-h');
  });

  test('ODataTable SSR height=300 - HTML 输出内联 --table-height:300px 样式', async () => {
    const html = await renderSSR(ODataTable, { data, columns, height: 300 });
    expect(html).toMatch(/--table-height:\s*300px/);
  });

  test('ODataTable SSR loading=true - HTML 输出包含 loading 容器', async () => {
    const html = await renderSSR(ODataTable, { data: [], columns, loading: true });
    expect(html).toContain('o-table-loading-wrap');
  });

  test('ODataTable SSR data=[] - HTML 输出包含空状态容器', async () => {
    const html = await renderSSR(ODataTable, { data: [], columns });
    expect(html).toContain('o-table-tip-wrap');
  });

  test('ODataTable SSR selection=true - HTML 输出包含 checkbox', async () => {
    const html = await renderSSR(ODataTable, { data, columns, selection: true });
    expect(html).toContain('o-table-row-checkbox');
  });

  test('ODataTable SSR border=all - HTML 输出包含 o-table-border-* 类', async () => {
    const html = await renderSSR(ODataTable, { data, columns, border: 'all' });
    expect(html).toMatch(/o-table-border-/);
  });

  test('ODataTable SSR stripe=true - HTML 输出包含 o-table-stripe 类', async () => {
    const html = await renderSSR(ODataTable, { data, columns, stripe: true });
    expect(html).toMatch(/o-table-stripe/);
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

  test('ODataTable hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data, columns });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ODataTable hydration size=small - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data, columns, size: 'small' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ODataTable hydration headerStyle=split-line - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data, columns, headerStyle: 'split-line' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  // 已修复：loading=true 时的 hydration mismatch 由 <div> 嵌入 <tbody> 导致（非法 HTML 嵌套被浏览器修正）。
  // 修复方式：将 <div class="empty-placeholder"> 改为 <tr><td class="empty-placeholder">。
  test('ODataTable hydration loading=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data: [], columns, loading: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  // 已修复：data=[] 时的 hydration mismatch由 <div> 嵌入 <tbody> 导致（非法 HTML 嵌套被浏览器修正）。
  // 修复方式：将 <div class="empty-placeholder"> 改为 <tr><td class="empty-placeholder">。
  test('ODataTable hydration data=[] - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data: [], columns });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ODataTable hydration selection=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data, columns, selection: true });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ODataTable hydration border=all - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ODataTable, { data, columns, border: 'all' });
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
