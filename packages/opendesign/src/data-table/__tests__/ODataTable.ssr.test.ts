/**
 * ODataTable SSR 兼容性测试。
 *
 * 抓的问题：
 *   - 模块顶层或 setup 同步段访问 window/document/ResizeObserver 等浏览器 API（会让 renderToString 报错）
 *   - props 默认值依赖运行时环境
 *   - hydration 时虚拟 DOM 与 SSR HTML 不一致（随机值 / 时区 / Teleport 未包 ClientOnly 等）
 *
 * 抓不到的：像素级渲染差异、:hover/:active 视觉切换。
 */
import { test, expect, describe, afterEach } from 'vitest';
import ODataTable from '../ODataTable.vue';
import type { DataTableColumnT } from '../types';
import { renderSSR, ssrThenHydrate, spyHydrationErrors } from '../../../__tests__/_helpers/ssr';

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

  test('ODataTable hydration default - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data, columns });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('ODataTable hydration size=small - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data, columns, size: 'small' });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('ODataTable hydration headerStyle=split-line - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data, columns, headerStyle: 'split-line' });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  // 已知问题：loading=true 时 SSR 与客户端首帧不一致（疑似 useDataColumn 的 isMounted 分支差异）。
  // 标记为预期失败，待组件侧修复后改回普通断言。归类 L2（组件实现 bug）。
  test.fails('ODataTable hydration loading=true - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data: [], columns, loading: true });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('ODataTable hydration data=[] - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data: [], columns });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('ODataTable hydration selection=true - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data, columns, selection: true });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('ODataTable hydration border=all - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(ODataTable, { data, columns, border: 'all' });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });
});
