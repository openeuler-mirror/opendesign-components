<script setup lang="tsx">
import { computed, ref, reactive, provide, onUnmounted, onMounted, markRaw } from 'vue';
import { useElementSize, useMounted } from '@vueuse/core';

import { debounceRAF, getValueByPath, setValueByPath } from '../_utils/helper.ts';
import { checkElementOverflow, getCssVariable } from '../_utils/dom.ts';
import { isNumeric } from '../_utils/is.ts';
import { IconLoading } from '../_utils/icons';
import { useResizeObserver } from '../hooks';
import OScroller from '../scrollbar/OScroller.vue';
import { DEFAULT_CELL_FIRST_COL_MARKER, DEFAULT_CELL_LAST_COL_MARKER, DEFAULT_ROW_LAST_MARKER, TableRowT } from '../table';
import { useTableCommon } from '../table/useTableCommon';
import {
  DataTableConditionUpdatePayload,
  DataTableSortUpdatePayload,
  DataTableSelectionPayload,
  DataTableSelectionChangePayload,
  DataTableSortMethodT,
  DataTableSortMethod,
  DataTableConditionValue,
  DataTableRowKeyValue,
  dataTableProps,
  EffectiveDataTableColumnT,
} from './types.ts';
import { getColumnPosition, getCellValue } from './utils.ts';
import TableCellRenderer from './TableCellRenderer.vue';
import TableColGroup from './TableColGroup.vue';
import { dataTableInjectKey, DataTableCtx } from './provide.ts';
import { useDataColumn } from './use-data-column.ts';
import { getRenderableComponent } from '../_utils/vue-utils.ts';

const props = defineProps(dataTableProps);
const emits = defineEmits<{
  /** 表格筛选条件更新,如果是排序条件更新则无payload */
  (e: 'condition-update', payload?: DataTableConditionUpdatePayload): void;
  /** 表格列排序更新 */
  (e: 'sort-update', payload: DataTableSortUpdatePayload): void;
  /** 单行选中状态更新 */
  (e: 'selection', payload: DataTableSelectionPayload): void;
  /** 多行选中状态更新 */
  (e: 'selection-change', payload: DataTableSelectionChangePayload): void;
  /** 全选状态更新 */
  (e: 'selection-all', allSelected: boolean): void;
  /** 列宽调整 */
  (e: 'column-resize', column: EffectiveDataTableColumnT, width: number): void;
}>();

type AllSlots = {
  /** thead插槽 */
  header?: (options: { columns: EffectiveDataTableColumnT[] }) => any;
  /** tbody插槽 */
  body?: (options: { columns: EffectiveDataTableColumnT[] }) => any;
  /** 加载状态插槽 */
  loading?: () => any;
  /** 空状态插槽 */
  empty?: () => any;
} & Record<`th_${string}`, (options: { column: EffectiveDataTableColumnT }) => any> &
  Record<`td_${string}`, (options: { column: EffectiveDataTableColumnT; row: TableRowT; cellValue: any; index: number }) => any>;

const slots = defineSlots<AllSlots>();

/** 表格筛选条件 */
const conditions = defineModel<Record<string, unknown>>('conditions', {
  /**
   * @important 兜底如果外面没有传值的情况
   */
  default: reactive({}),
});
/** 被选中行的rowKey对应的值 */
const selectionKeys = defineModel<DataTableRowKeyValue[]>('selection-keys', { default: [] });

const isMounted = useMounted();

const getTableFilterValue = (key: string) => {
  return getValueByPath(conditions.value, key) as string[];
};
const handleTableFilterChange = (key: string, newVal: DataTableConditionValue[]) => {
  setValueByPath(conditions.value, key, newVal);
  emits('condition-update', { key, newVal });
};

const getTableSorterValue = (key?: string): DataTableSortMethodT => {
  if (!key) {
    return;
  }
  return getValueByPath(conditions.value, key) as DataTableSortMethodT;
};
const sortKeys = computed(() => Array.from(new Set(props.columns.filter((v) => v.sortKey).map((v) => v.sortKey!))));
const handleTableSorterChange = (key?: string, newVal?: DataTableSortMethodT) => {
  if (!key) {
    return;
  }
  // 只允许单一排序条件，清空其他条件
  sortKeys.value.forEach((_key) => {
    setValueByPath(conditions.value, _key, DataTableSortMethod.NA);
  });
  setValueByPath(conditions.value, key, newVal);
  emits('condition-update');
  emits('sort-update', { key, newVal });
};

const allChecked = ref<number[]>([]);
const indeterminate = computed(() => {
  return Boolean(selectionKeys.value.length && selectionKeys.value.length !== props.data.length);
});
const handleRowSelectionChange = (key: string, newVal: DataTableRowKeyValue[]) => {
  emits('selection', { key, selected: !!newVal.length });
  if (selectionKeys.value.length === props.data?.length) {
    allChecked.value = [1];
    emits('selection-all', true);
  } else if (!selectionKeys.value.length) {
    allChecked.value = [];
    emits('selection-all', false);
  }
};
const handleSelectionAll = (newVal: DataTableRowKeyValue[]) => {
  emits('selection-all', !!newVal.length);
  const prev = selectionKeys.value;
  selectionKeys.value = newVal.length ? props.data.map((v) => v[props.rowKey] as DataTableRowKeyValue) || [] : [];
  emits('selection-change', { prev, cur: selectionKeys.value });
};

const rootRef = ref<HTMLDivElement>();
const { width: containerWidth } = useElementSize(rootRef);

const headerRef = ref<HTMLTableElement>();
const { height: headerTableHeight } = useElementSize(headerRef);

// 溢出阴影
const tableEl = ref<HTMLTableElement>();
const overflowState = ref<ReturnType<typeof checkElementOverflow>>();
const checkTableOverflow = debounceRAF(() => {
  if (!tableEl.value) {
    return;
  }
  overflowState.value = checkElementOverflow({
    element: tableEl.value,
    parentElement: rootRef.value,
    // 由于右固定列与前一列边框重合，宽容一个边框宽度
    threshold: Number.parseFloat(getCssVariable('--table-border-width', rootRef.value!)),
  });
});

const resizeObserver = useResizeObserver();
onMounted(() => {
  resizeObserver.observe(rootRef.value!, checkTableOverflow);
});
onUnmounted(() => {
  resizeObserver.unobserve(rootRef.value!, checkTableOverflow);
});

const getRowKey = (row: TableRowT, rowIndex: number) => {
  return (row[props.rowKey] as string) || rowIndex;
};

const { emptyLabel, loadingLabel, borderClass, handleMouseOver, clearHighlight, handleTouchStart } = useTableCommon({ props, tableEl });

const {
  dataColumnMap,
  dataColumns,
  groupColumns,
  isCellRemoved,
  isLastLeftFixedCell,
  isFirstRightFixedCell,
  isBeforeFirstRightFixedCell,
  handleColumnResizerMousedown,
  resizingColumnKey,
} = useDataColumn({ props, tableEl });

const setThRef = (el: any, column: EffectiveDataTableColumnT) => {
  if (!el) {
    return;
  }
  column.thRef = markRaw(el) as HTMLTableCellElement;
};

const exposeData = {
  containerWidth,
  dataColumnMap,
  dataColumns,
  groupColumns,
} as DataTableCtx; // TODO 修复实例化过深的报错

provide(dataTableInjectKey, exposeData);

defineExpose(exposeData);
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      'o-table',
      `o-table-${props.size}`,
      'o-data-table',
      {
        'o-table-stripe': props.stripe,
        'is-overflow-left': overflowState?.isOverflowLeft,
        'is-overflow-right': overflowState?.isOverflowRight,
        'is-overflow-top': overflowState?.isOverflowTop,
      },
    ]"
    :style="{
      '--table-header-height': headerTableHeight,
      '--table-height': isNumeric(props.height) ? props.height + 'px' : props.height,
      '--table-max-height': isNumeric(props.maxHeight) ? props.maxHeight + 'px' : props.maxHeight,
    }"
  >
    <OScroller
      class="o-table-scroller"
      :wrap-class="['o-table-wrap', ...borderClass]"
      :size="props.size"
      :disabled-x="props.loading || !props.data.length"
      show-type="always"
      auto-update-on-scroll-size
      @scroll="checkTableOverflow"
    >
      <table ref="tableEl" class="o-table-inner-table">
        <caption></caption>
        <TableColGroup />
        <thead ref="headerRef" class="o-table-header">
          <slot name="header" :columns="dataColumns">
            <tr v-for="groupColumn in groupColumns" :key="groupColumn[0]?.key" class="o-table-row o-table-header-row">
              <th
                v-for="(column, colIndex) in groupColumn"
                :key="column.key"
                :ref="(el) => setThRef(el, column)"
                :colspan="column.colSpan"
                :rowspan="column.rowSpan"
                :class="{
                  'o-table-cell': true,
                  'o-table-header-cell': true,
                  'o-table-cell-fixed': column.fixed,
                  'o-table-cell-fixed-left': column.fixed === 'left',
                  'o-table-cell-fixed-right': column.fixed === 'right',
                  'o-table-cell-last-left-fixed': column.isLastLeftFixedCol,
                  'o-table-cell-first-right-fixed': column.isFirstRightFixedCol,
                  'o-table-cell-before-first-right-fixed': column.isBeforeFirstRightFixedCol,
                  [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                  [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                }"
                :style="getColumnPosition({ column, columns: dataColumns })"
              >
                <span class="o-table-cell__inner">
                  <slot :name="`th_${column.key}`" :column="column">
                    <component :is="getRenderableComponent(column.label)" />
                  </slot>
                </span>
                <div
                  v-if="props.columnResizable && !column.children?.length"
                  class="o-table-column-resizer"
                  @mousedown="(event) => handleColumnResizerMousedown({ event, column, colIndex })"
                >
                  <div v-if="resizingColumnKey === column.key" class="o-table-column-resizer__indicator"></div>
                </div>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody class="o-table-body" @mousemove="handleMouseOver" @mouseleave="clearHighlight" @touchstart="handleTouchStart">
          <slot name="body" :columns="dataColumns">
            <tr
              v-for="(row, rowIndex) in props.data"
              :key="getRowKey(row, rowIndex)"
              :class="[
                'o-table-row',
                'o-table-body-row',
                {
                  [DEFAULT_ROW_LAST_MARKER]: rowIndex === props.data.length - 1,
                },
              ]"
            >
              <template v-for="(column, colIndex) in dataColumns" :key="column.key">
                <td
                  v-if="!isCellRemoved(rowIndex, colIndex)"
                  v-bind="props.spanMethod?.({ row, column, cellValue: getCellValue({ row, column }), rowIndex, colIndex })"
                  :class="{
                    'o-table-cell': true,
                    'o-table-body-cell': true,
                    'o-cell-last-row': rowIndex === props.data.length - 1,
                    'o-table-cell-fixed': column.fixed,
                    'o-table-cell-fixed-left': column.fixed === 'left',
                    'o-table-cell-fixed-right': column.fixed === 'right',
                    'o-table-cell-last-left-fixed': isLastLeftFixedCell(rowIndex, colIndex),
                    'o-table-cell-first-right-fixed': isFirstRightFixedCell(rowIndex, colIndex),
                    'o-table-cell-before-first-right-fixed': isBeforeFirstRightFixedCell(rowIndex, colIndex),
                    [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                    [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                  }"
                  :style="getColumnPosition({ column, columns: dataColumns })"
                >
                  <span class="o-table-cell__inner">
                    <slot :name="`td_${column.key}`" :row="row" :column="column" :cell-value="getCellValue({ row, column })" :index="rowIndex">
                      <TableCellRenderer :row="row" :column="column" :cell-value="getCellValue({ row, column })" :row-index="rowIndex" :col-index="colIndex" />
                    </slot>
                  </span>
                </td>
              </template>
            </tr>
          </slot>
          <div v-if="props.loading || !props.data?.length" class="empty-placeholder"></div>
        </tbody>
      </table>
    </OScroller>
    <div v-if="props.loading" class="o-table-loading-wrap">
      <slot name="loading">
        <IconLoading class="o-rotating" />
        <div class="o-table-loading-label">{{ loadingLabel }}</div>
      </slot>
    </div>
    <div v-else-if="!props.data?.length" class="o-table-tip-wrap">
      <slot v-if="!props.loading" name="empty">
        <div class="o-table-empty-label">{{ emptyLabel }}</div>
      </slot>
    </div>
  </div>
</template>
