/**
 * ODataTable ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import ODataTable from '../ODataTable.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import type { DataTableColumnT } from '../types';

const baseColumns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
];

const baseData = [
  { id: 'r1', name: 'Alice', age: 20 },
  { id: 'r2', name: 'Bob', age: 22 },
];

describe('ARIA — 数据表格', () => {
  test('表头 th 设 scope="col"', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    await flush();
    const ths = screen.container.querySelectorAll('thead th');
    expect(ths.length).toBeGreaterThan(0);
    for (const th of ths) {
      expect(th.getAttribute('scope')).toBe('col');
    }
  });

  /**
   * 渲染 selection 模式表格并返回当前各行 aria-selected 值。
   *
   * @param screen 渲染实例
   * @returns 各行 aria-selected 属性值数组
   */
  const rowSelectedStates = (screen: { container: HTMLElement }) =>
    [...screen.container.querySelectorAll('tbody tr[aria-selected]')].map((row) => row.getAttribute('aria-selected'));

  test('selection 模式下行设 aria-selected 反映选中态', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, selection: true } });
    await flush();
    const rows = screen.container.querySelectorAll('tbody tr[aria-selected]');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('selection 交互 - 初始全 false，点选行后镜像该行为 true，全选后全部 true', async () => {
    // 通过 v-model:selectedKeys 驱动选中集合，验证 aria-selected 与选中集合同构镜像
    const keys = ref<Array<string>>([]);
    const screen = render({
      setup() {
        return () =>
          h(ODataTable as any, {
            data: baseData,
            columns: baseColumns,
            selection: true,
            selectedKeys: keys.value,
            'onUpdate:selectedKeys': (v: Array<string>) => {
              keys.value = v;
            },
          });
      },
    });
    await flush();
    // 初始未选：selection 模式下每行渲染 aria-selected 且全为 false
    expect(rowSelectedStates(screen)).toEqual(['false', 'false']);
    // 点击第 2 行 checkbox 选中
    const rowCb = screen.container.querySelectorAll('tbody .o-table-row-checkbox input')[1] as HTMLInputElement;
    rowCb.click();
    await flush();
    expect(rowSelectedStates(screen)).toEqual(['false', 'true']);
    // 点击表头全选 checkbox：所有行镜像为 true
    const headCb = screen.container.querySelector('thead .o-table-row-checkbox input') as HTMLInputElement;
    headCb.click();
    await flush();
    expect(rowSelectedStates(screen)).toEqual(['true', 'true']);
  });

  test('loading - <table> 镜像 aria-busy=true，非 loading 时无该属性', async () => {
    const screen = render(ODataTable, {
      props: { data: baseData, columns: baseColumns, loading: true },
    });
    await flush();
    const table = screen.container.querySelector('table') as HTMLTableElement;
    expect(table.getAttribute('aria-busy')).toBe('true');

    const idle = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    await flush();
    const idleTable = idle.container.querySelector('table') as HTMLTableElement;
    expect(idleTable.getAttribute('aria-busy')).toBeNull();
  });

  test('disabledProp - 命中行镜像 aria-disabled=true，其余行无该属性', async () => {
    const data = [
      { id: 'd1', name: 'A', age: 1, myDisabled: true },
      { id: 'd2', name: 'B', age: 2, myDisabled: false },
    ];
    const screen = render(ODataTable, {
      props: { data, columns: baseColumns, disabledProp: 'myDisabled' },
    });
    await flush();
    const rows = [...screen.container.querySelectorAll('tbody tr')];
    expect(rows[0].getAttribute('aria-disabled')).toBe('true');
    expect(rows[1].getAttribute('aria-disabled')).toBeNull();
  });

  test('可排序列 th 镜像 aria-sort，非排序列无该属性', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name' },
      { label: 'Age', key: 'age', sortKey: 'age' },
    ];
    const conditions = ref<Record<string, number | undefined>>({ age: 1 });
    const screen = render(ODataTable, {
      props: {
        data: baseData,
        columns,
        conditions: conditions.value,
        'onUpdate:conditions': (v: Record<string, number | undefined>) => {
          conditions.value = v;
        },
      },
    });
    await flush();
    const ths = [...screen.container.querySelectorAll('thead th')];
    // 非排序列不输出 aria-sort
    expect(ths[0].getAttribute('aria-sort')).toBeNull();
    // 排序列初始升序（conditions.age = ASC = 1）
    expect(ths[1].getAttribute('aria-sort')).toBe('ascending');

    // 用户点击排序器：升 → 降（真实交互路径验证镜像翻转）
    const sorter = ths[1].querySelector('.o-data-table-sorter') as HTMLElement;
    sorter.click();
    await flush();
    expect(conditions.value.age).toBe(-1);
    expect(ths[1].getAttribute('aria-sort')).toBe('descending');

    // 再点：降 → 取消（NA），回到 none（WAI-ARIA：排序列未激活时输出 none）
    sorter.click();
    await flush();
    expect(ths[1].getAttribute('aria-sort')).toBe('none');
  });

  test('caption 镜像为 table 的 aria-label，未设置时无该属性', async () => {
    const plain = render(ODataTable, { props: { data: baseData, columns: baseColumns } });
    await flush();
    const plainTable = plain.container.querySelector('table') as HTMLElement;
    expect(plainTable.getAttribute('aria-label')).toBeNull();

    const named = render(ODataTable, { props: { data: baseData, columns: baseColumns, caption: '用户列表' } });
    await flush();
    const namedTable = named.container.querySelector('table') as HTMLElement;
    expect(namedTable.getAttribute('aria-label')).toBe('用户列表');
  });

  test('多条件排序下每列各自镜像自己的排序方向', async () => {
    const columns: DataTableColumnT[] = [
      { label: 'Name', key: 'name', sortKey: 'name' },
      { label: 'Age', key: 'age', sortKey: 'age' },
    ];
    const screen = render(ODataTable, {
      props: { data: baseData, columns, sortMode: 'multiple', conditions: { name: 1, age: -1 } },
    });
    await flush();
    const ths = [...screen.container.querySelectorAll('thead th')];
    expect(ths[0].getAttribute('aria-sort')).toBe('ascending');
    expect(ths[1].getAttribute('aria-sort')).toBe('descending');
  });
});
