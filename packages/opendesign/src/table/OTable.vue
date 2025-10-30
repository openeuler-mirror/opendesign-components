<script setup lang="ts">
import { tableProps, TableRowT, TableColumnT } from './types';
import { getColumnData, getBodyData } from './table';
import { computed, ref } from 'vue';
import { IconLoading } from '../_utils/icons';
import { isHoverDevice, isString } from '../_utils/is';
import { useI18n } from '../locale';
import { useTableMeta, DEFAULT_CELL_COL_MARKER, DEFAULT_ROW_MARKER } from './useTableMeta';

const props = defineProps(tableProps);

// type getT<T> = T extends (infer R)[] ? (R extends TableColumnT ? R['key'] : R) : never;
// type keyT = getT<typeof props.columns>;

defineSlots<{
  header(props: { columns: TableColumnT[] }): any;
  body(): any;
  empty(): any;
  loading(): any;
  [k: `th_${string}`]: (props: { column: TableColumnT }) => any;
  [k: `td_${string}`]: (props: { row: TableRowT }) => any;
}>();

const { t } = useI18n();

const columnData = computed(() => getColumnData(props.columns));

const tableData = computed(() => getBodyData(columnData, props.data, props.cellSpan));

const emptyLabel = computed(() => props.emptyLabel || t('common.empty'));
const loadingLabel = computed(() => props.loadingLabel || t('common.loading'));

const borderClass = computed(() => {
  if (isString(props.border)) {
    return props.border.split('-').map((item) => `o-table-border-${item}`);
  }
  return '';
});
const tableEl = ref<HTMLTableElement>();

// 通过 useTableMeta 获取表格元数据并添加或删除类名
// 之所以通过直接操作 dom 的方式处理，是因为用户可能通过插槽渲染表格，
// 导致无法通过tableData计算元数据以及无法通过vue模板语法设置类名
const tableMeta = useTableMeta(tableEl, { markCellLastCol: true, markCellLastRow: true, markRowLast: true });

const highlightedCells: Array<HTMLTableRowElement | HTMLTableCellElement> = [];
let highlightTrigger: HTMLTableCellElement | null = null;
const clearHighlight = () => {
  highlightedCells.forEach((cell) => {
    cell.classList.remove('o-table-highlight');
  });
  highlightedCells.length = 0;
  highlightTrigger = null;
};
const highlightCell = (cell: HTMLTableCellElement) => {
  if (highlightTrigger === cell) {
    // 避免重复添加高亮样式
    return;
  }
  clearHighlight();
  highlightTrigger = cell;
  const cellMeta = tableMeta.getMeta(cell);
  if (!cellMeta || cellMeta.section.scope !== 'body') {
    return;
  }
  const section = cellMeta.section;
  const rowEl = section.rows[cellMeta.rowStart];
  const rowSpan = cellMeta.el.rowSpan;
  highlightedCells.push(rowEl);
  rowEl.classList.add('o-table-highlight');
  if (rowSpan === 1) {
    const rows = section.data[cellMeta.rowStart];
    rows.forEach((item) => {
      if (item && item.el.parentElement !== rowEl) {
        highlightedCells.push(item.el);
        item.el.classList.add('o-table-highlight');
      }
    });
  } else {
    for (let i = cellMeta.rowStart + 1; i < cellMeta.rowEnd; i++) {
      const rowElItem = section.rows[i];
      if (rowElItem) {
        highlightedCells.push(rowElItem);
        rowElItem.classList.add('o-table-highlight');
      }
    }
  }
};
const getTdEl = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) {
    return null;
  }
  let current: HTMLElement | null = el;
  while (current && current.tagName !== 'TD' && current.tagName !== 'TH' && current !== tableEl.value && current !== document.body) {
    current = current.parentElement;
  }
  return current?.tagName === 'TD' ? (current as HTMLTableCellElement) : null;
};
const handleMouseOver = (e: MouseEvent) => {
  const target = getTdEl(e.target);
  if (!target || !isHoverDevice) {
    return;
  }
  highlightCell(target);
};
const handleTouchStart = (e: TouchEvent) => {
  const target = getTdEl(e.target);
  if (!target) {
    return;
  }
  highlightCell(target);
};
</script>
<template>
  <div
    class="o-table"
    :class="[
      {
        'o-table-small': props.small,
      },
    ]"
  >
    <div class="o-table-wrap" :class="borderClass">
      <table ref="tableEl" @mousemove="handleMouseOver" @mouseleave="clearHighlight" @touchstart="handleTouchStart">
        <colgroup>
          <col v-for="col in columnData" :key="col.key" :style="col.style" />
        </colgroup>
        <thead v-if="columnData.length > 1">
          <slot name="header" :columns="columnData">
            <tr>
              <th v-for="(col, idx) in columnData" :key="col.key || idx" :class="{ [DEFAULT_CELL_COL_MARKER]: idx + 1 === columnData.length }">
                <slot :name="`th_${col.key}`" :column="col">
                  {{ col.label }}
                </slot>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody v-if="tableData.length > 0">
          <slot name="body" :body="tableData">
            <tr v-for="(row, rIdx) in tableData" :key="row.key || rIdx" :class="{ [DEFAULT_ROW_MARKER]: rIdx + 1 === tableData.length }">
              <td
                :rowspan="col.rowspan"
                :colspan="col.colspan"
                :class="{ [DEFAULT_CELL_COL_MARKER]: col.last }"
                v-for="(col, idx) in row.data"
                :key="col.key || idx"
              >
                <slot :name="`td_${col.key}`" :row="props.data ? props.data[rIdx] : {}">
                  {{ col.value }}
                </slot>
              </td>
            </tr>
          </slot>
        </tbody>
      </table>
      <div v-if="!props.data || props.data.length === 0" class="o-table-tip-wrap">
        <slot v-if="!props.loading" name="empty">
          <div class="o-table-empty-label">{{ emptyLabel }}</div>
        </slot>
      </div>
    </div>
    <div v-if="props.loading" class="o-table-loading-wrap">
      <slot name="loading">
        <IconLoading class="o-rotating" />
        <div class="o-table-loading-label">{{ loadingLabel }}</div>
      </slot>
    </div>
  </div>
</template>
