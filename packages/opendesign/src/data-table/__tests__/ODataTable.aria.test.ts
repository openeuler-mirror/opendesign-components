/**
 * ODataTable ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
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

  test('selection 模式下行设 aria-selected 反映选中态', async () => {
    const screen = render(ODataTable, { props: { data: baseData, columns: baseColumns, selection: true } });
    await flush();
    const rows = screen.container.querySelectorAll('tbody tr[aria-selected]');
    expect(rows.length).toBeGreaterThan(0);
  });
});
