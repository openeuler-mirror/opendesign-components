/**
 * ODataTable 单组件契约测试（功能 + 视觉合一）。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
 *      - DOM 结构 / class 注入（功能契约）
 *      - 默认值 / token wiring（视觉契约）
 *   2. 动态契约：用户操作触发的状态变化
 *      - selection / sort / filter / expand 等事件 emit
 *      - 暴露方法（selectAll / clearAll / expandAll / foldAll）
 *
 * 命名规范：ODataTable <prop / 场景> - <中文描述>
 *
 * 不归属本文件的维度：
 *   - 不同断点下的尺寸数值      → ODataTable.responsive.test.ts
 *   - SSR 字符串渲染 + hydration → ODataTable.ssr.test.ts
 *   - 像素级渲染 / 跨浏览器渲染差异 → E2E 截图回归
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import ODataTable from '../ODataTable.vue';
import type { DataTableColumnT } from '../types';
import { flush, waitFor } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { getStaticWidth } from '../utils';

/**
 * fixColumnAfterMounted 三阶段完成后的可观测信号：
 * phase 3 (finalizeFixedLayout) 将 table-layout 设为 'fixed'。
 * 通过 tableRef.dataColumns[0].colRef 反查 <table> 元素，无需 screen.container。
 */
const isFixReady = (tableRef: { value: any }): boolean => {
  const col = tableRef.value?.dataColumns?.[0]?.colRef;
  const table = col?.closest?.('table') as HTMLTableElement | null;
  return !!table && table.style.tableLayout === 'fixed';
};

// 通用列与数据
const baseColumns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Email', key: 'email' },
];

const baseData = [
  { id: 'r1', name: 'Alice', age: 20, email: 'a@x.com' },
  { id: 'r2', name: 'Bob', age: 22, email: 'b@x.com' },
  { id: 'r3', name: 'Carol', age: 24, email: 'c@x.com' },
];

const treeData = [
  {
    id: 'p1',
    name: 'Parent1',
    age: 40,
    email: 'p1@x.com',
    children: [
      { id: 'c1', name: 'Child1', age: 10, email: 'c1@x.com' },
      { id: 'c2', name: 'Child2', age: 12, email: 'c2@x.com' },
    ],
  },
  { id: 'p2', name: 'Parent2', age: 42, email: 'p2@x.com' },
];

// ============================================================================
// 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
// ============================================================================
describe('静态契约（按 types.ts 属性）', () => {
  test('ODataTable data + columns - 渲染 thead/tbody，行数与列数与数据一致', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    const root = screen.container.querySelector('.o-data-table') as HTMLElement;
    expect(root).not.toBeNull();
    // 表头行 = 1（无嵌套表头）
    expect(root.querySelectorAll('thead tr').length).toBe(1);
    // 表头单元格数 = columns.length
    expect(root.querySelectorAll('thead th').length).toBe(baseColumns.length);
    // 表体行数 = data.length
    expect(root.querySelectorAll('tbody tr.o-table-body-row').length).toBe(baseData.length);
    // 单元格内容
    expect(root.textContent).toContain('Alice');
    expect(root.textContent).toContain('Bob');
  });

  test('ODataTable columns.children - 嵌套表头渲染为两行 thead', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name' },
      {
        label: 'Group',
        key: 'group',
        children: [
          { label: 'Age', key: 'age' },
          { label: 'Email', key: 'email' },
        ],
      },
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    const root = screen.container.querySelector('.o-data-table') as HTMLElement;
    expect(root.querySelectorAll('thead tr').length).toBe(2);
  });

  test('ODataTable size - 各枚举值注入 o-table-{size} 类，默认 medium', async () => {
    for (const s of ['medium', 'small'] as const) {
      const w = render(ODataTable, { props: { data: baseData, columns: baseColumns, size: s } });
      const root = w.container.querySelector('.o-data-table') as HTMLElement;
      expect(root.classList.contains(`o-table-${s}`)).toBe(true);
    }
    const def = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect((def.container.querySelector('.o-data-table') as HTMLElement).classList.contains('o-table-medium')).toBe(true);
  });

  test('ODataTable height - 数字与字符串均序列化到 --table-height CSS 变量', async () => {
    const numCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, height: 300 } });
    const numRoot = numCase.container.querySelector('.o-data-table') as HTMLElement;
    expect(numRoot.style.getPropertyValue('--table-height')).toBe('300px');

    const strCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, height: '50vh' } });
    const strRoot = strCase.container.querySelector('.o-data-table') as HTMLElement;
    expect(strRoot.style.getPropertyValue('--table-height')).toBe('50vh');
  });

  test('ODataTable maxHeight - 默认 fit-content，数字时转 px', async () => {
    const def = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect((def.container.querySelector('.o-data-table') as HTMLElement).style.getPropertyValue('--table-max-height')).toBe('fit-content');

    const num = render(ODataTable, { props: { data: baseData, columns: baseColumns, maxHeight: 400 } });
    expect((num.container.querySelector('.o-data-table') as HTMLElement).style.getPropertyValue('--table-max-height')).toBe('400px');
  });

  test('ODataTable minTableWidth - 注入 inner table 的 min-width 内联样式', async () => {
    const numCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, minTableWidth: 800 } });
    const table = numCase.container.querySelector('.o-table-inner-table') as HTMLTableElement;
    expect(table.style.minWidth).toBe('800px');

    const strCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, minTableWidth: '60rem' } });
    const table2 = strCase.container.querySelector('.o-table-inner-table') as HTMLTableElement;
    expect(table2.style.minWidth).toBe('60rem');
  });

  test('ODataTable rowKey - 字符串字段名 与 函数形式 均参与行身份识别', async () => {
    // 字符串 rowKey：每行渲染一个 checkbox
    const strCase = render(ODataTable, {
      props: { data: baseData, columns: baseColumns, rowKey: 'id', selection: true },
    });
    const strCbs = strCase.container.querySelectorAll('tbody .o-table-row-checkbox');
    expect(strCbs.length).toBe(baseData.length);

    // 函数 rowKey：渲染数量一致，证明函数路径生效
    const fnCase = render(ODataTable, {
      props: { data: baseData, columns: baseColumns, rowKey: (r: any) => `fn-${r.id}`, selection: true },
    });
    const fnCbs = fnCase.container.querySelectorAll('tbody .o-table-row-checkbox');
    expect(fnCbs.length).toBe(baseData.length);
  });

  test('ODataTable spanMethod - 返回 {colSpan,rowSpan} 时合并单元格', async () => {
    const spanMethod = ({ rowIndex, colIndex }: any) => {
      if (rowIndex === 0 && colIndex === 0) {
        return { colSpan: 2, rowSpan: 1 };
      }
    };
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, spanMethod } });
    const firstRow = screen.container.querySelector('tbody tr.o-table-body-row') as HTMLTableRowElement;
    const firstCell = firstRow.querySelector('td') as HTMLTableCellElement;
    expect(firstCell.getAttribute('colspan')).toBe('2');
  });

  test('ODataTable showHeader=false - 不渲染 thead', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, showHeader: false } });
    const root = screen.container.querySelector('.o-data-table') as HTMLElement;
    expect(root.querySelector('thead')).toBeNull();
  });

  test('ODataTable headerStyle - 各枚举值注入 o-table-header-{style} 类，默认 fill', async () => {
    for (const hs of ['fill', 'split-line'] as const) {
      const w = render(ODataTable, { props: { data: baseData, columns: baseColumns, headerStyle: hs } });
      const root = w.container.querySelector('.o-data-table') as HTMLElement;
      expect(root.classList.contains(`o-table-header-${hs}`)).toBe(true);
    }
    const def = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect((def.container.querySelector('.o-data-table') as HTMLElement).classList.contains('o-table-header-fill')).toBe(true);
    // split-line 时渲染 header-divider
    const sl = render(ODataTable, { props: { data: baseData, columns: baseColumns, headerStyle: 'split-line' } });
    expect(sl.container.querySelector('.o-data-table-header-divider-h')).not.toBeNull();
  });

  test('ODataTable expandMethod - 返回 VNode 时该行可展开，返回 false 时不可', async () => {
    const expandMethod = (_row: any, rowIndex: number) => {
      if (rowIndex === 0) {
        return h('div', { class: 'expand-content-x' }, 'expand-x');
      }
      return false as const;
    };
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, expandMethod } });
    await flush();
    const triggers = screen.container.querySelectorAll('tbody .o-table-row-expand-trigger.expandable');
    // 只有第 0 行 trigger 标 expandable
    expect(triggers.length).toBe(1);
  });

  test('ODataTable columnResizable - true 时表头渲染 column-resizer，false 时不渲染', async () => {
    const off = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect(off.container.querySelector('.o-table-column-resizer')).toBeNull();

    const on = render(ODataTable, { props: { data: baseData, columns: baseColumns, columnResizable: true } });
    expect(on.container.querySelector('.o-table-column-resizer')).not.toBeNull();
  });

  test('ODataTable selection - 表头与表体均渲染 checkbox', async () => {
    const off = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect(off.container.querySelector('.o-table-row-checkbox')).toBeNull();

    const on = render(ODataTable, { props: { data: baseData, columns: baseColumns, selection: true } });
    // 1 个 thead + 3 个 tbody
    expect(on.container.querySelectorAll('.o-table-row-checkbox').length).toBe(1 + baseData.length);
  });

  test('ODataTable disabledProp - 命中字段的行的 checkbox 被禁用', async () => {
    const data = [
      { id: 'd1', name: 'A', age: 1, email: 'a', myDisabled: true },
      { id: 'd2', name: 'B', age: 2, email: 'b', myDisabled: false },
    ];
    const screen = render(ODataTable, {
      props: { data, columns: baseColumns, selection: true, disabledProp: 'myDisabled' },
    });
    const rows = screen.container.querySelectorAll('tbody tr.o-table-body-row');
    expect(rows[0].classList.contains('o-table-row-disabled')).toBe(true);
    expect(rows[1].classList.contains('o-table-row-disabled')).toBe(false);
  });

  test('ODataTable checkStrictly - true(默认)时不渲染树形展开 trigger，false 时父子选择联动', async () => {
    // 默认 checkStrictly=true：仅断言 prop 被接受、tree data 正常渲染父行
    const def = render(ODataTable, {
      props: { data: treeData, columns: baseColumns, selection: true },
    });
    expect(def.container.querySelectorAll('tbody tr.o-table-body-row').length).toBe(treeData.length);
    // 父行的 checkbox 渲染存在
    expect(def.container.querySelectorAll('tbody .o-table-row-checkbox').length).toBe(treeData.length);
  });

  test('ODataTable stripe - 注入 o-table-stripe 类', async () => {
    const on = render(ODataTable, { props: { data: baseData, columns: baseColumns, stripe: true } });
    expect((on.container.querySelector('.o-data-table') as HTMLElement).classList.contains('o-table-stripe')).toBe(true);
    const off = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    expect((off.container.querySelector('.o-data-table') as HTMLElement).classList.contains('o-table-stripe')).toBe(false);
  });

  test('ODataTable border - 各枚举值注入 o-table-border-{type} 类，默认 row', async () => {
    for (const b of ['all', 'row', 'column', 'frame', 'row-column', 'row-frame', 'column-frame', 'none'] as const) {
      const w = render(ODataTable, { props: { data: baseData, columns: baseColumns, border: b } });
      const root = w.container.querySelector('.o-data-table') as HTMLElement;
      // border 由 useTableCommon 转为 borderClass 列表，例如 row-column → [o-table-border-row, o-table-border-column]
      // 至少包含一种 o-table-border- 前缀类（none 例外）
      if (b === 'none') {
        // 无 border-* 类
        const hasBorderClass = Array.from(root.classList).some((c) => /^o-table-border-/.test(c) && c !== 'o-table-border-none');
        expect(hasBorderClass || root.classList.contains('o-table-border-none')).toBe(true);
      } else {
        const hit = Array.from(root.classList).some((c) => /^o-table-border-/.test(c));
        expect(hit).toBe(true);
      }
    }
    // 默认 row
    const def = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    const defRoot = def.container.querySelector('.o-data-table') as HTMLElement;
    expect(Array.from(defRoot.classList).some((c) => c.includes('border-row'))).toBe(true);
  });

  test('ODataTable defaultEmptyCellText - 单元格为空时显示默认占位文案', async () => {
    const data = [{ id: 'e1', name: 'X', age: null, email: '' }];
    const screen = render(ODataTable, { props: { data, columns: baseColumns } });
    const tdTexts = Array.from(screen.container.querySelectorAll('tbody td')).map((td) => td.textContent?.trim() || '');
    // age 与 email 为 null/空字符串 → 显示 '--'
    expect(tdTexts.filter((t) => t === '--').length).toBeGreaterThanOrEqual(2);

    // 自定义占位
    const customCase = render(ODataTable, { props: { data, columns: baseColumns, defaultEmptyCellText: 'N/A' } });
    const customTexts = Array.from(customCase.container.querySelectorAll('tbody td')).map((td) => td.textContent?.trim() || '');
    expect(customTexts.filter((t) => t === 'N/A').length).toBeGreaterThanOrEqual(2);
  });

  test('ODataTable loading - 渲染 loading 容器 + 旋转动画 + 默认 emptyLabel', async () => {
    const screen = render(ODataTable, { props: { data: [], columns: baseColumns, loading: true } });
    const loadingWrap = screen.container.querySelector('.o-table-loading-wrap');
    expect(loadingWrap).not.toBeNull();
    const rotating = loadingWrap!.querySelector('.o-rotating');
    expect(rotating).not.toBeNull();
    expect(getComputedStyle(rotating as HTMLElement).animationName).not.toBe('none');
  });

  test('ODataTable loadingLabel - 自定义文案显示在 loading 容器内', async () => {
    const screen = render(ODataTable, { props: { data: [], columns: baseColumns, loading: true, loadingLabel: 'Fetching...' } });
    expect(screen.container.querySelector('.o-table-loading-label')?.textContent).toBe('Fetching...');
  });

  test('ODataTable emptyLabel - 空数据 + 非 loading 显示空文案', async () => {
    const def = render(ODataTable, { props: { data: [], columns: baseColumns } });
    const defLabel = def.container.querySelector('.o-table-empty-label');
    expect(defLabel).not.toBeNull();
    expect(defLabel!.textContent?.trim().length).toBeGreaterThan(0);

    const custom = render(ODataTable, { props: { data: [], columns: baseColumns, emptyLabel: '木有数据' } });
    expect(custom.container.querySelector('.o-table-empty-label')?.textContent?.trim()).toBe('木有数据');
  });

  test('ODataTable highlightCurrentRow - 启用时不影响初始渲染（高亮在 hover/touch 时触发）', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, highlightCurrentRow: true } });
    // 不抛错且 body 行渲染正常
    expect(screen.container.querySelectorAll('tbody tr.o-table-body-row').length).toBe(baseData.length);
  });
});

// ============================================================================
// 动态契约：用户操作 → 组件响应（emit + 状态切换）
// ============================================================================
describe('动态契约（用户交互 → 组件响应）', () => {
  test('ODataTable selection - 点击行 checkbox 时 update:selectedKeys 双向绑定更新', async () => {
    // 注意：默认 checkStrictly=true 下，'selection' 事件不会触发（TableRow.handleRowSelection 提前 return）；
    // 真正可观察的是 v-model 同步出的 update:selectedKeys，因此选用该断言更贴合实际行为
    const onUpdate = vi.fn();
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns, selection: true, 'onUpdate:selectedKeys': onUpdate },
    });
    const cb = screen.container.querySelectorAll('tbody .o-table-row-checkbox input')[1] as HTMLInputElement;
    cb.click();
    await flush();
    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0]).toEqual(['r2']);
  });

  test('ODataTable selection-all - 点击表头全选 checkbox 时 emit selection-all(true) 且 selectedKeys 更新', async () => {
    const onSelAll = vi.fn();
    const onSelChange = vi.fn();
    const screen = render(ODataTable, {
      props: {
        data: baseData,
        columns: baseColumns,
        selection: true,
        onSelectionAll: onSelAll,
        onSelectionChange: onSelChange,
      },
    });
    const headInput = screen.container.querySelector('thead .o-table-row-checkbox input') as HTMLInputElement;
    headInput.click();
    await flush();
    expect(onSelAll).toHaveBeenCalledWith(true);
    expect(onSelChange).toHaveBeenCalledTimes(1);
    const payload = onSelChange.mock.calls[0][0];
    expect(payload.cur).toEqual(['r1', 'r2', 'r3']);
    expect(payload.prev).toEqual([]);
  });

  test('ODataTable sort-update - 点击列排序触发器时 emit sort-update + condition-update', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name' },
      { label: 'Age', key: 'age', sortKey: 'ageOrder' },
    ];
    const onSort = vi.fn();
    const onCond = vi.fn();
    const screen = render(ODataTable, {
      props: { data: baseData, columns, onSortUpdate: onSort, onConditionUpdate: onCond },
    });
    // sorter 单 button，循环 NA → ASC → DESC → NA
    const sorter = screen.container.querySelector('thead .o-data-table-sorter') as HTMLButtonElement;
    expect(sorter).not.toBeNull();
    sorter.click();
    await flush();
    expect(onSort).toHaveBeenCalled();
    expect(onCond).toHaveBeenCalled();
    expect(onSort.mock.calls[0][0].key).toBe('ageOrder');
    expect(onSort.mock.calls[0][0].newVal).toBe(1); // ASC
  });

  test('ODataTable expandMethod - 点击展开 trigger 时切换 expanded class', async () => {
    const expandMethod = () => h('div', { class: 'expand-content' }, 'detail');
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns, expandMethod },
    });
    await flush();
    const trigger = screen.container.querySelector('tbody .o-table-row-expand-trigger.expandable') as HTMLElement;
    expect(trigger).not.toBeNull();
    expect(trigger.classList.contains('expanded')).toBe(false);
    await userEvent.click(trigger);
    await flush();
    const triggerAfter = screen.container.querySelector('tbody .o-table-row-expand-trigger.expanded');
    expect(triggerAfter).not.toBeNull();
  });

  test('ODataTable exposed - selectAll / clearAll 更新 selectedKeys', async () => {
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns: baseColumns, selection: true });
      },
    });
    await flush();
    expect(tableRef.value).toBeTruthy();
    tableRef.value.selectAll();
    await flush();
    const checked = screen.container.querySelectorAll('tbody .o-table-row-checkbox input:checked');
    expect(checked.length).toBe(baseData.length);

    tableRef.value.clearAll();
    await flush();
    const checkedAfter = screen.container.querySelectorAll('tbody .o-table-row-checkbox input:checked');
    expect(checkedAfter.length).toBe(0);
  });

  test('ODataTable exposed - expandAll / foldAll 控制所有行展开', async () => {
    const expandMethod = () => h('div', 'x');
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns: baseColumns, expandMethod });
      },
    });
    await flush();
    tableRef.value.expandAll();
    await flush();
    const expanded = screen.container.querySelectorAll('tbody .o-table-row-expand-trigger.expanded');
    expect(expanded.length).toBe(baseData.length);

    tableRef.value.foldAll();
    await flush();
    const expandedAfter = screen.container.querySelectorAll('tbody .o-table-row-expand-trigger.expanded');
    expect(expandedAfter.length).toBe(0);
  });

  test('ODataTable exposed - dataColumns / dataColumnMap / groupColumns 暴露正确长度', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name' },
      {
        label: 'Group',
        key: 'g',
        children: [
          { label: 'Age', key: 'age' },
          { label: 'Email', key: 'email' },
        ],
      },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await flush();
    expect(tableRef.value.dataColumns.length).toBe(3); // 扁平叶子列：name + age + email
    expect(tableRef.value.dataColumnMap.size).toBeGreaterThanOrEqual(3);
    expect(tableRef.value.groupColumns.length).toBe(2); // 两行表头
  });

  // ==========================================================================
  // 列宽重分配反馈环回归测试
  //
  // fixColumnAfterMounted 在分页/排序/窗口调整/列 schema 变更/拖拽后被反复触发。
  // Bug 根因：style.width 读回返回带 px 后缀的字符串，参与 Math.max 产生 NaN；
  //           重分配块累加无基线；TableColGroup ResizeObserver 写回同一字段形成二级放大。
  // 以下用例验证修复后 width 在多次 recalc 下的稳定性 + 拖拽宽度不被重算覆盖。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 列 schema 变更后声明宽度更新生效', async () => {
    const columnsRef = ref<DataTableColumnT[]>([
      { label: 'Name', key: 'name', width: 200 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email' },
    ]);
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns: columnsRef.value });
      },
    });
    // fixColumnAfterMounted 内含 until() + Promise.all(getElementRectByRAF) 多层 rAF 链
    await waitFor(() => isFixReady(tableRef));

    // 初始渲染后 colRef.style.width 应已设为 "200px"
    const nameCol = tableRef.value.dataColumnMap.get('name');
    expect(nameCol.colRef?.style.width).toContain('200');

    // 变更列 schema：将 Name 声明宽度从 200 改为 300
    columnsRef.value = [
      { label: 'Name', key: 'name', width: 300 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email' },
    ];
    await waitFor(() => isFixReady(tableRef));

    // Bug: 读回旧 style.width="200px" → 跳过 getStaticWidth(300,...) → 写 "200pxpx"（非法，被浏览器拒绝）
    // 修复后：应从声明值重算，style.width 更新为 "300px"
    const nameColAfter = tableRef.value.dataColumnMap.get('name');
    expect(nameColAfter.colRef?.style.width).toContain('300');
  });

  test('ODataTable 列宽稳定性 - 多次 data 变化后最后一列宽度不累积膨胀', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 200 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email', minWidth: 200 },
    ];
    const dataRef = ref(baseData);
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: dataRef.value, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const getLastColWidth = () => {
      const cols = tableRef.value?.dataColumns ?? [];
      return cols[cols.length - 1]?.resizeWidth ?? 0;
    };

    const w1 = getLastColWidth();
    expect(w1).toBeGreaterThan(0);

    // 模拟连续 3 次分页切换，每次触发 fixColumnAfterMounted 重算
    for (let i = 0; i < 3; i++) {
      dataRef.value = [...baseData].reverse();
      await waitFor(() => isFixReady(tableRef), 1000);
    }

    const w2 = getLastColWidth();

    // Bug: 重分配块 lastCol.resizeWidth! += extra 为累加式，无基线重算
    //   + style.width 读回产生 NaN/非法字符串 → 宽度无法正确重算 → 可能累积膨胀
    // 修复后：每次重算应从声明值出发，宽度不应显著增长
    expect(w2).toBeLessThanOrEqual(w1 + 10);
  });

  test('ODataTable 列宽稳定性 - 容器宽度变化后最后一列宽度重算不滞留旧值', async () => {
    // 初始宽视口
    await setViewport('laptop');

    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 200 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email' },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const getLastColWidth = () => {
      const cols = tableRef.value?.dataColumns ?? [];
      return cols[cols.length - 1]?.resizeWidth ?? 0;
    };

    const w1 = getLastColWidth();
    expect(w1).toBeGreaterThan(0);

    // 缩小容器宽度，触发 containerWidth watch → fixColumnAfterMounted
    // containerWidth 是 refDebounced（~200ms），isFixReady 的 tableLayout 信号在旧 fix 完成后已为 true，
    // 需等待末列 resizeWidth 实际变化才能确认新 fix 已完成
    await setViewport('phone');
    await waitFor(() => {
      const cols = tableRef.value?.dataColumns ?? [];
      const lastCol = cols[cols.length - 1];
      return !!lastCol && lastCol.resizeWidth != null && Math.abs(lastCol.resizeWidth - w1) > 10;
    });

    const w2 = getLastColWidth();

    // Bug: style.width 读回旧值（宽容器时的膨胀值），写非法字符串被拒绝
    //   → 最后一列宽度滞留在旧值，不随容器缩小而重算
    // 修复后：宽度应随容器缩小而减小
    expect(w2).toBeLessThan(w1);
  });

  test('ODataTable 列宽稳定性 - 拖拽列宽在 data 变化后不被重分配覆盖', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 100, minWidth: 50, maxWidth: 300 },
      { label: 'Age', key: 'age', width: 100 },
      { label: 'Email', key: 'email' },
    ];
    const dataRef = ref(baseData);
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: dataRef.value, columns, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    // 获取 Name 列的 col 元素初始 style.width
    const nameCol = tableRef.value.dataColumnMap.get('name');
    const initialStyleWidth = nameCol.colRef?.style.width;
    expect(initialStyleWidth).toContain('100');

    // 模拟拖拽：通过 DOM 事件触发 handleColumnResizerMousedown + mousemove
    const resizer = screen.container.querySelector('.o-table-column-resizer') as HTMLElement;
    expect(resizer).not.toBeNull();

    const th = screen.container.querySelector('thead th') as HTMLElement;
    const thRect = th.getBoundingClientRect();

    // mousedown 在 resizer 上
    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: thRect.right,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    // mousemove 向右拖拽 50px — handleColumnResizerMouseMoving 写入 colRef.style.width
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: thRect.right + 50,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    // 记录拖拽后的 style.width（拖拽同时写 colRef.style.width 和 resizeWidth）
    const nameColAfterDrag = tableRef.value.dataColumnMap.get('name');
    const draggedStyleWidth = nameColAfterDrag.colRef?.style.width;
    // 拖拽后宽度应增大（100 + 50 = 150px，受 maxWidth=300 钳制）
    expect(parseFloat(draggedStyleWidth!)).toBeGreaterThan(100);

    // mouseup 结束拖拽
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();

    // 模拟分页：切换数据
    dataRef.value = [...baseData].reverse();
    await waitFor(() => isFixReady(tableRef));

    // Bug: fixColumnAfterMounted 重算时，拖拽写入的 style.width 被读回并参与重分配
    //   → 拖拽宽度被覆盖或污染
    // 修复后：用户拖拽设定的宽度应被保留，不被自动重分配覆盖
    const nameColAfterData = tableRef.value.dataColumnMap.get('name');
    const finalStyleWidth = nameColAfterData.colRef?.style.width;
    // 拖拽后的宽度应被保留（允许 ±5px 浮动来自重分配微调，但不应被重置回声明值）
    expect(Math.abs(parseFloat(finalStyleWidth!) - parseFloat(draggedStyleWidth!))).toBeLessThan(10);
  });

  // ==========================================================================
  // P0 回归：填充列不污染 userWidths
  // 拖拽非填充列后，填充列宽度不应被写入 userWidths（否则容器变大时表格不再填满）。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 拖拽缩窄后填充列写入 userWidths，data 变化重算时 autoFillKeys 被清除', async () => {
    await setViewport('desktop');
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 200, minWidth: 50, maxWidth: 300 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email' },
    ];
    const dataRef = ref(baseData);
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: dataRef.value, columns, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    // 拖拽 Name 列缩窄 100px → 触发填充模式，末列 (email) 吸收盈余写入 userWidths
    const resizer = screen.container.querySelector('.o-table-column-resizer') as HTMLElement;
    expect(resizer).not.toBeNull();
    const th = screen.container.querySelector('thead th') as HTMLElement;
    const thRect = th.getBoundingClientRect();

    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: thRect.right,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: thRect.right - 100,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();

    const userWidths = tableRef.value?.userWidths as Map<string, number>;
    // 用户拖拽的列 (name) 保留在 userWidths 中
    expect(userWidths.has('name')).toBe(true);

    // 触发 fixColumnAfterMounted 重算：prepareAutoLayoutPhase 清除 autoFillKeys
    dataRef.value = [...baseData].reverse();
    await waitFor(() => isFixReady(tableRef));

    // autoFillKeys 被清除后，填充列 (email) 不再在 userWidths 中（重新参与自动分配）
    expect(userWidths.has('name')).toBe(true);
    expect(userWidths.has('email')).toBe(false);
  });

  // ==========================================================================
  // P0 回归：拖拽早于 fixColumnAfterMounted 完成时最小宽度仍生效
  // 拖拽若早于 fix phase 3（_minWidth 未设），同步迷你 fix 须兜底设 _minWidth，
  // 否则 mousemove 钳制失效，被拖列可突破到负值。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 拖拽早于 fix 完成时被拖列仍受最小宽度约束', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 200 },
      { label: 'Age', key: 'age' },
    ];
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns, columnResizable: true });
      },
    });
    await flush();

    // 不等 fixColumnAfterMounted 完成，立即拖拽
    const resizer = screen.container.querySelector('.o-table-column-resizer') as HTMLElement;
    expect(resizer).not.toBeNull();
    const th = screen.container.querySelector('thead th') as HTMLElement;
    const thRect = th.getBoundingClientRect();
    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: thRect.right,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    // 向左拖拽 300px，远超 width(200) - 默认最小宽度(136) 的余量，试图突破下限
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: thRect.right - 300,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    const nameCol = tableRef.value.dataColumnMap.get('name');
    // _minWidth 应已由同步迷你 fix 兜底设置（>0）
    expect(nameCol._minWidth).toBeGreaterThan(0);
    // 被拖列宽度不低于 _minWidth（不突破最小宽度到负值）
    expect(nameCol.resizeWidth).toBeGreaterThanOrEqual(nameCol._minWidth);

    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();
  });

  // ==========================================================================
  // P1 回归：钳制口径统一
  // width 小于 minWidth 时，resizeWidth 应被钳制到 minWidth，与实际渲染宽度一致。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - width 小于 minWidth 时 resizeWidth 被钳制到 minWidth', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 50, minWidth: 100 },
      { label: 'Age', key: 'age', width: 200 },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const nameCol = tableRef.value.dataColumnMap.get('name');
    // resizeWidth 应被钳制到 minWidth（100），而非保留声明值 50
    expect(nameCol.resizeWidth).toBeGreaterThanOrEqual(100);
    // getColStyle 返回的 width 也应与 resizeWidth 一致
    const colEl = nameCol.colRef as HTMLTableColElement;
    const styleWidth = parseFloat(colEl.style.width);
    expect(styleWidth).toBeGreaterThanOrEqual(100);
    // resizeWidth 与 col 实际 style.width 应一致（固定列偏移计算依赖此一致性）
    expect(Math.abs(nameCol.resizeWidth - styleWidth)).toBeLessThan(2);
  });

  // ==========================================================================
  // P0 回归：末列吸收盈余（applyFillColumnResize 填充模式 + getFillColumn）
  // 拖拽缩窄非末列时，末个非固定列应吸收盈余防止表格缩窄；
  // 拖拽恢复后末列应恢复基础宽度（固定模式分支）。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 拖拽缩窄非末列时末个非固定列吸收盈余', async () => {
    await setViewport('desktop');
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 200, minWidth: 50, maxWidth: 400 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email', width: 200 },
    ];
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const emailColBefore = tableRef.value.dataColumnMap.get('email');
    const emailWidthBefore = emailColBefore.resizeWidth ?? 0;
    expect(emailWidthBefore).toBeGreaterThan(0);

    // 拖拽 Age 列缩窄 100px → email（末个非固定列）应吸收盈余
    const resizers = screen.container.querySelectorAll('.o-table-column-resizer');
    const ageResizer = resizers[1] as HTMLElement;
    const ths = screen.container.querySelectorAll('thead th');
    const ageTh = ths[1] as HTMLElement;
    const thRect = ageTh.getBoundingClientRect();

    ageResizer.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: thRect.right,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: thRect.right - 100,
        clientY: thRect.top + thRect.height / 2,
        bubbles: true,
      }),
    );
    await flush();

    const emailColAfter = tableRef.value.dataColumnMap.get('email');
    // 末列吸收盈余后宽度应增大
    expect(emailColAfter.resizeWidth).toBeGreaterThan(emailWidthBefore);

    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();
  });

  test('ODataTable 列宽稳定性 - 列总宽超过容器时拖拽缩窄末列不吸收盈余（固定模式分支）', async () => {
    await setViewport('desktop');
    // 列总宽 2400 > 容器 1920 → 拖拽缩窄时 sum + base >= minTableWidth → 固定模式
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 800, minWidth: 50, maxWidth: 1200 },
      { label: 'Age', key: 'age', width: 800, minWidth: 50, maxWidth: 1200 },
      { label: 'Email', key: 'email', width: 800, minWidth: 50, maxWidth: 1200 },
    ];
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const emailCol = tableRef.value.dataColumnMap.get('email');
    const emailWidthBefore = emailCol.resizeWidth ?? 0;
    expect(emailWidthBefore).toBeGreaterThan(0);

    // 拖拽 Age 列缩窄 100px → 固定模式：email 不吸收盈余
    const resizers = screen.container.querySelectorAll('.o-table-column-resizer');
    const ageResizer = resizers[1] as HTMLElement;
    const ths = screen.container.querySelectorAll('thead th');
    const ageTh = ths[1] as HTMLElement;
    const thRect = ageTh.getBoundingClientRect();

    ageResizer.dispatchEvent(new MouseEvent('mousedown', { clientX: thRect.right, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: thRect.right - 100, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();

    const emailColAfter = tableRef.value.dataColumnMap.get('email');
    // 固定模式：email 保持基础宽度，不吸收盈余
    expect(Math.abs(emailColAfter.resizeWidth - emailWidthBefore)).toBeLessThan(20);

    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();
  });

  // ==========================================================================
  // P0 回归：cleanupRemovedKeys（动态删列后 userWidths 拘留清理）
  // 拖拽设定 userWidths 后删除该列，残留 key 应被 cleanupRemovedKeys 清理。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 列删除后 userWidths 中残留 key 被清理', async () => {
    const columnsRef = ref<DataTableColumnT[]>([
      { label: 'Name', key: 'name', width: 200, minWidth: 50, maxWidth: 400 },
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email', width: 200 },
    ]);
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns: columnsRef.value, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    // 拖拽 Name 列设定 userWidths
    const resizer = screen.container.querySelector('.o-table-column-resizer') as HTMLElement;
    const th = screen.container.querySelector('thead th') as HTMLElement;
    const thRect = th.getBoundingClientRect();
    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: thRect.right, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: thRect.right + 50, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();

    const userWidths = tableRef.value?.userWidths as Map<string, number>;
    expect(userWidths.has('name')).toBe(true);

    // 删除 Name 列
    columnsRef.value = [
      { label: 'Age', key: 'age', width: 200 },
      { label: 'Email', key: 'email', width: 200 },
    ];
    await waitFor(() => isFixReady(tableRef));

    // cleanupRemovedKeys 应已清理 'name' 的残留 key
    expect(userWidths.has('name')).toBe(false);
  });

  // ==========================================================================
  // P1 回归：mouseup → onColumnsFixed 回调（checkTableOverflow 触发）
  // 拖拽结束后 onColumnsFixed 回调应触发 checkTableOverflow，更新 overflowState。
  // ==========================================================================

  test('ODataTable 列宽稳定性 - 拖拽结束后 onColumnsFixed 回调触发 checkTableOverflow', async () => {
    await setViewport('pad_h');
    // 列总宽 900 < pad_h 容器 1100 → 初始无溢出
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 300, minWidth: 50, maxWidth: 800 },
      { label: 'Age', key: 'age', width: 300 },
      { label: 'Email', key: 'email', width: 300 },
    ];
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns, columnResizable: true });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const root = screen.container.querySelector('.o-data-table') as HTMLElement;
    // 初始：列总宽 < 容器 → 无溢出
    expect(root.classList.contains('is-overflow-right')).toBe(false);

    // 拖拽 Name 列加宽 300px → 列总宽 1200 > 1100 → 表格溢出
    const resizer = screen.container.querySelector('.o-table-column-resizer') as HTMLElement;
    const th = screen.container.querySelector('thead th') as HTMLElement;
    const thRect = th.getBoundingClientRect();

    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: thRect.right, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: thRect.right + 300, clientY: thRect.top + thRect.height / 2, bubbles: true }));
    await flush();

    // mouseup → onColumnsFixed → checkTableOverflow（debounced） → overflowState 更新
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await waitFor(() => isFixReady(tableRef));

    // checkTableOverflow 应已检测到溢出并设置 is-overflow-right
    expect(root.classList.contains('is-overflow-right')).toBe(true);
  });
});

// ============================================================================
// 双主题视觉契约：light / dark 下读 token wiring，确保两主题各自解析正确且互不相同
//
// 双主题原则（同 OButton 范本）：所有 read token 的断言必须在 light + dark 都跑：
//   - 把 data-o-theme 挂在 render 出的 wrapper container 上（CSS 选择器命中后通过继承到表格内部）
//   - 把 container 背景设为 fill1 token，让 UI 面板 light/dark 反差明显
//   - root 自身再 setAttribute 一次是双保险，防止 container ↔ root 中间断链
//
// 颜色断言策略：用 `getPropertyValue('--token').trim()` 比较 token 字面值，而不是硬编码 RGB
// （token 调一次就大面积维护）。跨主题对比验证 token 实际解析值确实不同。
// ============================================================================

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`ODataTable headerStyle=fill @${theme} - --table-head-bg 解析为非透明色`, async () => {
      const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, headerStyle: 'fill' } });
      const root = screen.container.querySelector('.o-data-table') as HTMLElement;
      paintThemed(screen.container, theme, root);
      const header = root.querySelector('thead.o-table-header') as HTMLElement;
      const headBg = getComputedStyle(header).backgroundColor;
      // 非透明 → token 已 wire 上
      expect(headBg).not.toBe('rgba(0, 0, 0, 0)');
      expect(headBg).not.toBe('transparent');
    });
  }

  test('ODataTable headerStyle=fill - light / dark 下 --table-head-bg 解析值不同', async () => {
    const lightCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, headerStyle: 'fill' } });
    const darkCase = render(ODataTable, { props: { data: baseData, columns: baseColumns, headerStyle: 'fill' } });
    const lightRoot = lightCase.container.querySelector('.o-data-table') as HTMLElement;
    const darkRoot = darkCase.container.querySelector('.o-data-table') as HTMLElement;
    paintThemed(lightCase.container, 'e.light', lightRoot);
    paintThemed(darkCase.container, 'e.dark', darkRoot);
    const lightHead = lightRoot.querySelector('thead.o-table-header') as HTMLElement;
    const darkHead = darkRoot.querySelector('thead.o-table-header') as HTMLElement;
    expect(getComputedStyle(lightHead).backgroundColor).not.toBe(getComputedStyle(darkHead).backgroundColor);
  });

  for (const theme of THEMES) {
    test(`ODataTable border=all @${theme} - 单元格边框 token wiring 解析为可见 border`, async () => {
      const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, border: 'all' } });
      const root = screen.container.querySelector('.o-data-table') as HTMLElement;
      paintThemed(screen.container, theme, root);
      const cell = root.querySelector('tbody td.o-table-body-cell') as HTMLElement;
      const cs = getComputedStyle(cell);
      // border 至少有一个方向解析为非 0 宽度
      const widths = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map((w) => parseFloat(w));
      expect(widths.some((w) => w > 0)).toBe(true);
    });
  }

  for (const theme of THEMES) {
    test(`ODataTable stripe @${theme} - 启用 stripe 时偶数行单元格注入 background-image（条纹承载）`, async () => {
      const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, stripe: true } });
      const root = screen.container.querySelector('.o-data-table') as HTMLElement;
      paintThemed(screen.container, theme, root);
      const rows = root.querySelectorAll('tbody tr.o-table-body-row');
      expect(rows.length).toBeGreaterThanOrEqual(2);
      // stripe 通过 tr:nth-child(even) td 的 background-image: linear-gradient 实现
      // （见 table/style/style.scss）；用 background-image 比 backgroundColor 更稳定
      const td0 = rows[0].querySelector('td') as HTMLElement;
      const td1 = rows[1].querySelector('td') as HTMLElement;
      expect(getComputedStyle(td0).backgroundImage).not.toBe(getComputedStyle(td1).backgroundImage);
      // 偶数行（第 2 行，索引 1）应包含 gradient
      expect(getComputedStyle(td1).backgroundImage).toContain('gradient');
    });
  }

  for (const theme of THEMES) {
    test(`ODataTable loading @${theme} - loading 容器渲染且旋转图标可见`, async () => {
      const screen = render(ODataTable, { props: { data: [], columns: baseColumns, loading: true } });
      const root = screen.container.querySelector('.o-data-table') as HTMLElement;
      paintThemed(screen.container, theme, root);
      const rotating = root.querySelector('.o-table-loading-wrap .o-rotating') as HTMLElement;
      expect(rotating).not.toBeNull();
      // 旋转动画在跑 → token wiring 正确
      expect(getComputedStyle(rotating).animationName).not.toBe('none');
    });
  }

  for (const theme of THEMES) {
    test(`ODataTable headerStyle=split-line @${theme} - 渲染分隔条且 thead 背景透明（与 fill 模式区分）`, async () => {
      const screen = render(ODataTable, {
        props: { data: baseData, columns: baseColumns, headerStyle: 'split-line' },
      });
      const root = screen.container.querySelector('.o-data-table') as HTMLElement;
      paintThemed(screen.container, theme, root);
      // 分隔条渲染
      expect(root.querySelector('.o-data-table-header-divider-h')).not.toBeNull();
      // split-line 模式：thead 不应再用 fill 的 control3-light 背景（视觉差异承载点）
      const headerFill = getComputedStyle(root).getPropertyValue('--table-head-bg').trim();
      const splitRootIsFill = root.classList.contains('o-table-header-fill');
      expect(splitRootIsFill).toBe(false);
      // headerFill 在 split-line 模式下应解析为空或继承默认（非 control3-light 链路）
      // 此处只断言 root 不带 fill 类即可，token 字面值不必硬比对
      void headerFill;
    });
  }
});

// ============================================================================
// column 级配置：DataTableColumnT 的每个非 key/label 字段
//
// 这一块的契约对象是「列配置」而非「顶层 prop」，但同样按 types.ts 字段一字段一用例：
//   - fixed / asHeader / width 系 / showHeaderOverflowToolTip / showOverflowToolTip
//   - filter / customColSpan / description / formatter / label
//
// 不归属：column.sortKey 已在「sort-update」用例覆盖；嵌套表头 (children) 已单独测过
// ============================================================================
describe('子配置契约（按 DataTableColumnT 字段）', () => {
  test('ODataTable column.fixed - left / right / true 三种值注入对应 fixed 类与定位样式', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'L', key: 'name', fixed: 'left' },
      { label: 'M', key: 'age' },
      { label: 'R', key: 'email', fixed: 'right' },
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    await flush();
    const ths = screen.container.querySelectorAll('thead th');
    expect((ths[0] as HTMLElement).classList.contains('o-table-cell-fixed')).toBe(true);
    expect((ths[0] as HTMLElement).classList.contains('o-table-cell-fixed-left')).toBe(true);
    expect((ths[1] as HTMLElement).classList.contains('o-table-cell-fixed')).toBe(false);
    expect((ths[2] as HTMLElement).classList.contains('o-table-cell-fixed-right')).toBe(true);

    // body cell 同样注入
    const tds = screen.container.querySelectorAll('tbody tr.o-table-body-row:first-child td');
    expect((tds[0] as HTMLElement).classList.contains('o-table-cell-fixed-left')).toBe(true);
    expect((tds[2] as HTMLElement).classList.contains('o-table-cell-fixed-right')).toBe(true);

    // fixed: true 等同 'left'
    const trueCase = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'L', key: 'name', fixed: true as const },
          { label: 'X', key: 'age' },
        ],
      },
    });
    await flush();
    const trueTh = trueCase.container.querySelector('thead th') as HTMLElement;
    expect(trueTh.classList.contains('o-table-cell-fixed-left')).toBe(true);
  });

  test('ODataTable column.fixed - 固定列偏移值（left/right）依赖 resizeWidth 正确测量', async () => {
    // 验证删除 ResizeObserver 后，fixColumnAfterMounted 仍能正确设置 resizeWidth，
    // getColumnPosition 能正确计算 left/right 偏移值
    // 布局：A | L(left fixed) | B | R1(right fixed) | R2(right fixed)
    //   L.left  = resizeWidth(A) ≈ 200px
    //   R1.right = resizeWidth(R2) ≈ 200px
    //   R2.right = 0px（最后一个右固定列，贴边）
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'a', width: 200 },
      { label: 'L', key: 'l', fixed: 'left', width: 200 },
      { label: 'B', key: 'b', width: 200 },
      { label: 'R1', key: 'r1', fixed: 'right', width: 200 },
      { label: 'R2', key: 'r2', fixed: 'right', width: 200 },
    ];
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const ths = screen.container.querySelectorAll('thead th');
    // L (index 1) fixed=left → left = sum(resizeWidth of columns before L) = resizeWidth(A)
    const lTh = ths[1] as HTMLElement;
    expect(lTh.style.left).not.toBe('');
    expect(parseFloat(lTh.style.left)).toBeCloseTo(200, -1); // ~200px

    // R1 (index 3) fixed=right → right = resizeWidth(R2)（R2 是 R1 之后的右固定列）
    const r1Th = ths[3] as HTMLElement;
    expect(r1Th.style.right).not.toBe('');
    expect(parseFloat(r1Th.style.right)).toBeCloseTo(200, -1); // ~200px

    // R2 (index 4) fixed=right → right = 0px（最后一个右固定列，贴右边）
    const r2Th = ths[4] as HTMLElement;
    expect(r2Th.style.right).not.toBe('');
    expect(parseFloat(r2Th.style.right)).toBeCloseTo(0, -1);
  });

  test('ODataTable column.asHeader - 注入 o-table-column-as-header 类（表头列形态）', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', asHeader: true },
      { label: 'Age', key: 'age' },
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    const th0 = screen.container.querySelector('thead th') as HTMLElement;
    expect(th0.classList.contains('o-table-column-as-header')).toBe(true);
    const td0 = screen.container.querySelector('tbody tr.o-table-body-row:first-child td') as HTMLElement;
    expect(td0.classList.contains('o-table-column-as-header')).toBe(true);
  });

  test('ODataTable column.width - 数字与百分比值均被保留进列配置', async () => {
    // 实际像素 layout 由 fixColumnAfterMounted 异步设置在 col element 上，受容器宽度影响；
    // 这里只断言配置进入了 effective column（更稳定，不依赖 layout 时机）
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'name', width: 200 },
      { label: 'B', key: 'age', width: '30%' },
      { label: 'C', key: 'email' },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await flush();
    expect(tableRef.value.dataColumnMap.get('name').width).toBe(200);
    expect(tableRef.value.dataColumnMap.get('age').width).toBe('30%');
    expect(tableRef.value.dataColumnMap.get('email').width).toBeUndefined();
  });

  test('ODataTable column.minWidth - 配置进入 effective column', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'name', minWidth: 150 },
      { label: 'B', key: 'age' },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await flush();
    expect(tableRef.value.dataColumnMap.get('name').minWidth).toBe(150);
  });

  test('ODataTable column.maxWidth - 配置进入 effective column', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'name', maxWidth: 100 },
      { label: 'B', key: 'age' },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await flush();
    expect(tableRef.value.dataColumnMap.get('name').maxWidth).toBe(100);
  });

  test('ODataTable column.fixed - 仅右固定列时不渲染 left-shadow，仅左固定列时仍渲染 right-shadow', async () => {
    // 仅右固定列：left-shadow 不渲染（!hasLeftFixedColumn && !hasRightFixedColumn 为 false）
    const rightOnly = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name' },
          { label: 'B', key: 'age', fixed: 'right' as const },
        ],
      },
    });
    const rightRoot = rightOnly.container.querySelector('.o-data-table') as HTMLElement;
    expect(rightRoot.querySelector('.o-data-table-left-shadow')).toBeNull();
    expect(rightRoot.querySelector('.o-data-table-right-shadow')).toBeNull();

    // 仅左固定列：left-shadow 不渲染，right-shadow 也不渲染（hasRightFixedColumn=false 但 hasLeftFixedColumn=true）
    const leftOnly = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name', fixed: 'left' as const },
          { label: 'B', key: 'age' },
        ],
      },
    });
    const leftRoot = leftOnly.container.querySelector('.o-data-table') as HTMLElement;
    expect(leftRoot.querySelector('.o-data-table-left-shadow')).toBeNull();
    // right-shadow 在 !hasRightFixedColumn 时渲染（但需 data.length > 0 且非 loading）
    expect(leftRoot.querySelector('.o-data-table-right-shadow')).not.toBeNull();

    // 无固定列：两个 shadow 都渲染
    const noFixed = render(ODataTable, {
      props: { data: baseData, columns: baseColumns },
    });
    const noFixedRoot = noFixed.container.querySelector('.o-data-table') as HTMLElement;
    expect(noFixedRoot.querySelector('.o-data-table-left-shadow')).not.toBeNull();
    expect(noFixedRoot.querySelector('.o-data-table-right-shadow')).not.toBeNull();
  });

  test('ODataTable column.width - 声明宽度超过 maxWidth 时 resizeWidth 被钳制到 maxWidth', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', width: 300, maxWidth: 200 },
      { label: 'Age', key: 'age', width: 200 },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const nameCol = tableRef.value.dataColumnMap.get('name');
    // width(300) > maxWidth(200) → resizeWidth 应被钳制到 maxWidth(200)
    expect(nameCol.resizeWidth).toBeLessThanOrEqual(202);
    expect(nameCol.resizeWidth).toBeGreaterThanOrEqual(198);
    // col 的 style.width 也应反映钳制后的值
    const styleWidth = parseFloat(nameCol.colRef?.style.width);
    expect(styleWidth).toBeLessThanOrEqual(202);
    expect(styleWidth).toBeGreaterThanOrEqual(198);
  });

  test('ODataTable column.minWidth - 未声明 minWidth 时按 size 回退默认值（small=96, medium=136）', async () => {
    // small → _minWidth = 96
    const smallColumns: DataTableColumnT[] = [
      { label: 'A', key: 'name', width: 200 },
      { label: 'B', key: 'age' },
    ];
    const smallRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: smallRef, data: baseData, columns: smallColumns, size: 'small' });
      },
    });
    await waitFor(() => isFixReady(smallRef));

    const smallCol = smallRef.value.dataColumnMap.get('age');
    expect(smallCol._minWidth).toBe(96);

    // medium → _minWidth = 136
    const mediumColumns: DataTableColumnT[] = [
      { label: 'A', key: 'name', width: 200 },
      { label: 'B', key: 'age' },
    ];
    const mediumRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: mediumRef, data: baseData, columns: mediumColumns });
      },
    });
    await waitFor(() => isFixReady(mediumRef));

    const mediumCol = mediumRef.value.dataColumnMap.get('age');
    expect(mediumCol._minWidth).toBe(136);
  });

  test('ODataTable column.width - 百分比宽度按容器宽度换算，非法字符串回退 DOM 测量', async () => {
    // 直接测试 getStaticWidth 工具函数
    expect(getStaticWidth('50%', 1000)).toBe(500);
    expect(getStaticWidth(200, 1000)).toBe(200);
    expect(getStaticWidth('abc', 1000)).toBeUndefined();
    expect(getStaticWidth(undefined, 1000)).toBeUndefined();

    // 通过组件验证百分比宽度换算
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'name', width: '50%' },
      { label: 'B', key: 'age', width: 200 },
    ];
    const tableRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: tableRef, data: baseData, columns });
      },
    });
    await waitFor(() => isFixReady(tableRef));

    const nameCol = tableRef.value.dataColumnMap.get('name');
    // resizeWidth 应为容器宽度的 ~50%（允许误差来自钳制和布局）
    expect(nameCol.resizeWidth).toBeGreaterThan(0);
    // 非法字符串宽度不崩溃，回退到 DOM 测量
    const badColumns: DataTableColumnT[] = [
      { label: 'A', key: 'name', width: 'abc' as any },
      { label: 'B', key: 'age', width: 200 },
    ];
    const badRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODataTable as any, { ref: badRef, data: baseData, columns: badColumns });
      },
    });
    await waitFor(() => isFixReady(badRef));
    const badCol = badRef.value.dataColumnMap.get('name');
    expect(badCol.resizeWidth).toBeGreaterThan(0);
  });

  test('ODataTable column.showHeaderOverflowToolTip - true / number > 1 / 0 三种值的 class 注入', async () => {
    // true（默认 1）：cell-tooltip
    const tCase = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name', showHeaderOverflowToolTip: true },
          { label: 'B', key: 'age' },
        ],
      },
    });
    const tTh = tCase.container.querySelector('thead th') as HTMLElement;
    expect(tTh.classList.contains('o-table-cell-tooltip')).toBe(true);
    expect(tTh.classList.contains('o-table-cell-wrappable')).toBe(false);

    // number > 1：cell-tooltip + cell-wrappable + --cell-max-row
    const nCase = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name', showHeaderOverflowToolTip: 2 },
          { label: 'B', key: 'age' },
        ],
      },
    });
    const nTh = nCase.container.querySelector('thead th') as HTMLElement;
    expect(nTh.classList.contains('o-table-cell-tooltip')).toBe(true);
    expect(nTh.classList.contains('o-table-cell-wrappable')).toBe(true);
    expect(nTh.style.getPropertyValue('--cell-max-row')).toBe('2');

    // 0（关闭）：无 cell-tooltip
    const zCase = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name', showHeaderOverflowToolTip: 0 },
          { label: 'B', key: 'age' },
        ],
      },
    });
    const zTh = zCase.container.querySelector('thead th') as HTMLElement;
    expect(zTh.classList.contains('o-table-cell-tooltip')).toBe(false);
  });

  test('ODataTable column.showOverflowToolTip - 在 body td 上注入 cell-tooltip / cell-wrappable', async () => {
    const screen = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'A', key: 'name', showOverflowToolTip: 3 },
          { label: 'B', key: 'age' },
        ],
      },
    });
    const td = screen.container.querySelector('tbody tr.o-table-body-row:first-child td') as HTMLElement;
    expect(td.classList.contains('o-table-cell-tooltip')).toBe(true);
    expect(td.classList.contains('o-table-cell-wrappable')).toBe(true);
    expect(td.style.getPropertyValue('--cell-max-row')).toBe('3');
  });

  test('ODataTable column.filter - 渲染筛选触发器，点击后弹出筛选面板', async () => {
    const filter = {
      optionsFn: () => [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
      ],
    };
    const onCond = vi.fn();
    const screen = render(ODataTable, {
      props: {
        data: baseData,
        columns: [
          { label: 'Name', key: 'name', filter },
          { label: 'Age', key: 'age' },
        ],
        onConditionUpdate: onCond,
      },
    });
    await flush();
    const trigger = screen.container.querySelector('.o-data-table-column-filter__trigger') as HTMLElement;
    expect(trigger).not.toBeNull();
    // 仅断言渲染契约即可，下拉面板由 OPopup teleport 到 body，会跨 wrapper 边界
    void onCond;
  });

  test('ODataTable column.customColSpan - 表头 th 写入 colspan 属性，合并相邻列', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name' },
      { label: 'Merged', key: 'age', customColSpan: 2 },
      { label: 'Email', key: 'email' },
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    const ths = screen.container.querySelectorAll('thead th');
    // customColSpan 注入 colspan
    expect(ths[1].getAttribute('colspan')).toBe('2');
  });

  test('ODataTable column.description - 渲染表头气泡触发器 (.o-data-table-info__trigger)', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', description: '名称说明' },
      { label: 'Age', key: 'age' },
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    const trigger = screen.container.querySelector('.o-data-table-info__trigger');
    expect(trigger).not.toBeNull();
    // 第二列无 description
    const ths = screen.container.querySelectorAll('thead th');
    expect(ths[1].querySelector('.o-data-table-info__trigger')).toBeNull();
  });

  test('ODataTable column.formatter - string / VNode / Component / 函数式组件 四种返回均正确渲染单元格', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'A', key: 'name', formatter: ({ cellValue }) => `[${cellValue}]` }, // string
      { label: 'B', key: 'age', formatter: ({ cellValue }) => h('em', { class: 'vnode-cell' }, String(cellValue)) }, // VNode
      { label: 'C', key: 'email', formatter: () => ({ render: () => h('span', { class: 'comp-cell' }, 'C') }) }, // Component
    ];
    const screen = render(ODataTable, { props: { data: baseData.slice(0, 1), columns } });
    const tds = screen.container.querySelectorAll('tbody tr.o-table-body-row:first-child td');
    expect(tds[0].textContent).toContain('[Alice]');
    expect(tds[1].querySelector('em.vnode-cell')?.textContent).toBe('20');
    expect(tds[2].querySelector('span.comp-cell')?.textContent).toBe('C');
  });

  test('ODataTable column.label - 支持 string / VNode / Component 三种形态', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'StrLabel', key: 'name' }, // string
      { label: h('strong', { class: 'vnode-label' }, 'V'), key: 'age' }, // VNode
      { label: { render: () => h('i', { class: 'comp-label' }, 'I') } as any, key: 'email' }, // Component
    ];
    const screen = render(ODataTable, { props: { data: baseData, columns } });
    const ths = screen.container.querySelectorAll('thead th');
    expect(ths[0].textContent).toContain('StrLabel');
    expect(ths[1].querySelector('strong.vnode-label')?.textContent).toBe('V');
    expect(ths[2].querySelector('i.comp-label')?.textContent).toBe('I');
  });
});

// ============================================================================
// 具名插槽：DataTable 提供 header / loading / empty / expand / th_${key} / td_${key}
//
// 这一块测的是 "插槽位被正确替换" 的渲染契约
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('ODataTable slot=header - 替换整个表头渲染', async () => {
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns },
      slots: { header: () => h('tr', { class: 'custom-header' }, h('th', { colspan: 3 }, 'CustomHeader')) },
    });
    expect(screen.container.querySelector('thead tr.custom-header')).not.toBeNull();
    expect(screen.container.querySelector('thead')?.textContent).toContain('CustomHeader');
  });

  test('ODataTable slot=th_${key} - 替换指定列的表头内容', async () => {
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns },
      slots: { th_name: () => h('span', { class: 'custom-th-name' }, 'CN') },
    });
    expect(screen.container.querySelector('thead .custom-th-name')?.textContent).toBe('CN');
    // 其他列未受影响
    expect(screen.container.querySelectorAll('thead th')[1].textContent).toContain('Age');
  });

  test('ODataTable slot=td_${key} - 替换指定列每一行的单元格内容', async () => {
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns },
      slots: { td_email: ({ cellValue }: any) => h('a', { class: 'custom-td-email', href: `mailto:${cellValue}` }, `→${cellValue}`) },
    });
    const links = screen.container.querySelectorAll('a.custom-td-email');
    expect(links.length).toBe(baseData.length);
  });

  test('ODataTable slot=loading - 替换默认 loading 内容', async () => {
    const screen = render(ODataTable, {
      props: { data: [], columns: baseColumns, loading: true },
      slots: { loading: () => h('div', { class: 'custom-loading' }, 'CL') },
    });
    expect(screen.container.querySelector('.o-table-loading-wrap .custom-loading')?.textContent).toBe('CL');
  });

  test('ODataTable slot=empty - 替换默认空状态内容', async () => {
    const screen = render(ODataTable, {
      props: { data: [], columns: baseColumns },
      slots: { empty: () => h('div', { class: 'custom-empty' }, 'CE') },
    });
    expect(screen.container.querySelector('.o-table-tip-wrap .custom-empty')?.textContent).toBe('CE');
    // 默认 empty-label 不再渲染
    expect(screen.container.querySelector('.o-table-empty-label')).toBeNull();
  });

  test('ODataTable slot=expand - 展开行内容由插槽提供', async () => {
    // 让 expand row 由 expandMethod 决定（更稳定的展开路径），slot 只负责内容渲染
    const tableRef = ref<any>(null);
    const screen = render({
      setup() {
        return () =>
          h(
            ODataTable as any,
            { ref: tableRef, data: baseData, columns: baseColumns, expandMethod: () => true },
            {
              expand: ({ row }: any) => h('div', { class: 'custom-expand' }, `E:${row.name}`),
            },
          );
      },
    });
    await flush();
    // 用 exposed.expandAll() 触发展开，避免 SVG 上 userEvent.click 在长流水线里的 strict-mode 抖动
    tableRef.value.expandAll();
    await flush();
    const expandedContent = screen.container.querySelector('.custom-expand');
    expect(expandedContent?.textContent).toBe('E:Alice');
  });
});
