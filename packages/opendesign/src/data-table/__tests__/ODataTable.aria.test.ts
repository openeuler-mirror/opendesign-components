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
});
