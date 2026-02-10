<script setup lang="tsx">
import { computed, ref, reactive, provide, markRaw, toRefs, watch } from 'vue';
import { useElementSize, useCssVar } from '@vueuse/core';

import { vOnResize } from '../directives';
import { debounceRAF, getValueByPath, setValueByPath } from '../_utils/helper.ts';
import { checkElementOverflow, getCssVariable } from '../_utils/dom.ts';
import { isFunction, isNil, isNumeric } from '../_utils/is.ts';
import { IconLoading, IconChevronRight } from '../_utils/icons';
import { getRenderableComponent } from '../_utils/vue-utils.ts';
import { OScroller } from '../scrollbar';
import { OCheckbox } from '../checkbox';
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
import TableColumnFilter from './TableColumnFilter.vue';
import TableColumnSorter from './TableColumnSorter.vue';
import { dataTableInjectKey, DataTableCtx } from './provide.ts';
import { useDataColumn } from './use-data-column.ts';

const props = defineProps(dataTableProps);
const emits = defineEmits<{
  /** 表格筛选条件更新,如果是排序条件更新则无payload */
  (e: 'condition-update', payload?: DataTableConditionUpdatePayload): void;
  /** 表格列排序更新 */
  (e: 'sort-update', payload: DataTableSortUpdatePayload): void;
  /** 选中双向绑定状态更新 */
  (e: 'update:selected-keys', payload: DataTableRowKeyValue[]): void;
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
  header?: (options: { columns: EffectiveDataTableColumnT[]; groupColumns: EffectiveDataTableColumnT[][] }) => any;
  /** 加载状态插槽 */
  loading?: () => any;
  /** 空状态插槽 */
  empty?: () => any;
  /** 行展开插槽 */
  expand?: (scope: { row: TableRowT; rowIndex: number }) => any;
} & Record<`th_${string}`, (options: { column: EffectiveDataTableColumnT }) => any> &
  Record<`td_${string}`, (options: { column: EffectiveDataTableColumnT; row: TableRowT; cellValue: any; index: number }) => any>;

const slots = defineSlots<AllSlots>();

const rootRef = ref<HTMLDivElement>();
const { width: containerWidth } = useElementSize(rootRef);

const headerRef = ref<HTMLTableElement>();
const { height: headerTableHeight } = useElementSize(headerRef);
const tableTextSize = useCssVar('--table-text-size', headerRef);
const tableTextHeight = useCssVar('--table-text-height', headerRef);

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
    // 由于右固定列与前一列边框重合，宽容两个边框宽度
    threshold: Number.parseFloat(getCssVariable('--table-border-width', rootRef.value!)) * 2,
  });
});

const getRowKey = (row: TableRowT, rowIndex: number): DataTableRowKeyValue => {
  if (isFunction(props.rowKey)) {
    return props.rowKey(row) ?? rowIndex;
  }
  return (getValueByPath(row, props.rowKey) as string) ?? rowIndex;
};

const { emptyLabel, loadingLabel, borderClass, handleMouseOver, clearHighlight, handleTouchStart } = useTableCommon({ ...toRefs(props), tableEl });

const {
  dataColumnMap,
  dataColumns,
  groupColumns,
  isBodyCellRemoved,
  isLastLeftFixedCell,
  isFirstRightFixedCell,
  hasLeftFixedColumn,
  hasRightFixedColumn,
  handleColumnResizerMousedown,
  resizingColumnKey,
} = useDataColumn({ ...toRefs(props), tableEl, containerWidth });

const setThRef = (el: any, column: EffectiveDataTableColumnT) => {
  if (!el) {
    return;
  }
  column.thRef = markRaw(el) as HTMLTableCellElement;
};

/**
 * @zh-CN 已展开的行的rowKey
 * @en-US rowKey of expanded rows
 */
const expandedRowKeys = defineModel<DataTableRowKeyValue[]>('expanded-row-keys', { default: reactive([]) });
const isRowExpanded = (row: any, rowIndex: number) => !!expandedRowKeys.value.includes(getRowKey(row, rowIndex));
const toggleRowExpand = (row: any, rowIndex: number) => {
  const rowKey = getRowKey(row, rowIndex);
  const index = expandedRowKeys.value.findIndex((v) => v === rowKey);
  if (index === -1) {
    expandedRowKeys.value.push(rowKey);
  } else {
    expandedRowKeys.value.splice(index, 1);
  }
};

const isTableExpandable = computed(() => {
  if (slots.expand) {
    return { expandable: true, expandableRowIndexes: props.data.map((_, i) => i) };
  }
  if (isNil(props.expandMethod)) {
    return { expandable: false, expandableRowIndexes: [] };
  }
  let expandable = false;
  const expandableRowIndexes: number[] = [];
  props.data.forEach((row, rowIndex) => {
    if (props.expandMethod?.(row, rowIndex)) {
      expandable = true;
      expandableRowIndexes.push(rowIndex);
    }
  });
  return { expandable, expandableRowIndexes };
});
const isRowExpandable = (rowIndex: number) => {
  if (!isTableExpandable.value.expandable) {
    return false;
  }
  return isTableExpandable.value.expandableRowIndexes.includes(rowIndex);
};

/**
 * @zh-CN 表格筛选条件
 * @en-US Table filter conditions
 */
const conditions = defineModel<Record<string, unknown>>('conditions', {
  /**
   * @important 兜底如果外面没有传值的情况
   */
  default: reactive({}),
});

const getTableFilterValue = (key: string) => {
  return getValueByPath(conditions.value, key) as string[];
};
const handleTableFilterChange = (key: string, newVal: DataTableConditionValue[]) => {
  setValueByPath(conditions.value, key, newVal);
  emits('condition-update', { key, newVal });
};

const getTableSorterValue = (key: string): DataTableSortMethodT => {
  return getValueByPath(conditions.value, key) as DataTableSortMethodT;
};
const sortKeys = computed(() => Array.from(new Set(dataColumns.value.filter((v) => v.sortKey).map((v) => v.sortKey!))));
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

const selectionChangedBySelect = ref(false);
const _selectedKeys = computed<DataTableRowKeyValue[]>({
  get() {
    return props.selectedKeys;
  },
  set(newVal) {
    selectionChangedBySelect.value = true;
    emits('update:selected-keys', newVal);
  },
});
const allChecked = ref<number[]>([]);
const indeterminate = computed(() => {
  return Boolean(_selectedKeys.value.length && _selectedKeys.value.length !== props.data.length);
});
watch(
  _selectedKeys,
  () => {
    if (selectionChangedBySelect.value) {
      return;
    }

    if (_selectedKeys.value.length === props.data?.length) {
      allChecked.value = [1];
    } else if (!_selectedKeys.value.length) {
      allChecked.value = [];
    }
    selectionChangedBySelect.value = false;
  },
  { immediate: true },
);
const handleRowSelectionChange = (key: DataTableRowKeyValue, newVal: DataTableRowKeyValue[]) => {
  emits('selection', { key, selected: !!newVal.length });
  if (_selectedKeys.value.length === props.data?.length) {
    allChecked.value = [1];
    emits('selection-all', true);
  } else if (!_selectedKeys.value.length) {
    allChecked.value = [];
    emits('selection-all', false);
  }
};
const handleSelectionAll = (newVal: DataTableRowKeyValue[]) => {
  emits('selection-all', !!newVal.length);
  const prev = _selectedKeys.value;
  _selectedKeys.value = newVal.length ? props.data.map((v, i) => getRowKey(v, i)) || [] : [];
  emits('selection-change', { prev, cur: _selectedKeys.value });
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
    v-on-resize="checkTableOverflow"
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
      ...borderClass,
    ]"
    :style="{
      '--table-header-height': headerTableHeight,
      '--table-height': isNumeric(props.height) ? props.height + 'px' : props.height,
      '--table-max-height': isNumeric(props.maxHeight) ? props.maxHeight + 'px' : props.maxHeight,
    }"
  >
    <div v-if="!hasLeftFixedColumn && !props.loading && props.data.length" class="o-data-table-left-shadow"></div>
    <OScroller
      class="o-table-scroller"
      wrap-class="o-table-wrap"
      bar-class="o-table-scroll-bar"
      :size="props.size"
      :disabled-x="props.loading || !props.data.length"
      show-type="always"
      auto-update-on-scroll-size
      @scroll="checkTableOverflow"
    >
      <table
        ref="tableEl"
        class="o-table-inner-table"
        :style="{
          minWidth: isNumeric(props.minTableWidth) ? `${props.minTableWidth}px` : props.minTableWidth,
        }"
      >
        <caption></caption>
        <TableColGroup />
        <thead ref="headerRef" class="o-table-header">
          <slot name="header" :columns="dataColumns" :group-columns="groupColumns">
            <tr v-for="groupColumn in groupColumns" :key="groupColumn[0]?.key" class="o-table-row o-table-header-row">
              <template v-for="(column, colIndex) in groupColumn" :key="column.key">
                <th
                  v-if="!column.headerHidden"
                  :ref="(el) => setThRef(el, column)"
                  :colspan="column.colSpan || column.customColSpan"
                  :rowspan="column.rowSpan"
                  :class="{
                    'o-table-cell': true,
                    'o-table-header-cell': true,
                    'o-table-last-header-row-cell': !column.children?.length,
                    'o-table-cell-fixed': column.fixed,
                    'o-table-cell-fixed-left': column.fixed === 'left',
                    'o-table-cell-fixed-right': column.fixed === 'right',
                    'o-table-cell-last-left-fixed': column.isLastLeftFixedCol,
                    'o-table-cell-first-right-fixed': column.isFirstRightFixedCol,
                    [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                    [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                  }"
                  :style="getColumnPosition({ column, dataColumns, groupColumns, border: props.border, isHeader: true })"
                >
                  <span class="o-table-cell__inner">
                    <OCheckbox
                      v-if="column.isFirstCol && props.selection"
                      v-model="allChecked"
                      :indeterminate="indeterminate"
                      :value="1"
                      class="o-table-row-checkbox"
                      @change="handleSelectionAll"
                    />
                    <span v-if="column.isFirstCol && !props.selection && isTableExpandable.expandable" class="o-table-row-icon-placeholder" />
                    <slot :name="`th_${column.key}`" :column="column">
                      <component :is="getRenderableComponent(column.label)" />
                    </slot>
                    <TableColumnFilter
                      v-if="column.filter"
                      :disabled="props.loading"
                      :column="column"
                      :model-value="getTableFilterValue(column.key)"
                      :style="{
                        '--table-text-size': tableTextSize,
                        '--table-text-height': tableTextHeight,
                      }"
                      @update:model-value="(newVal) => handleTableFilterChange(column.key, newVal)"
                    />
                    <TableColumnSorter
                      v-else-if="column.sortKey"
                      :disabled="props.loading"
                      :model-value="getTableSorterValue(column.sortKey)"
                      @update:model-value="(newVal) => handleTableSorterChange(column.sortKey, newVal)"
                    />
                  </span>
                  <div
                    v-if="props.columnResizable && (isNil(column.customColSpan) || column.customColSpan <= 1) && !column.children?.length"
                    class="o-table-column-resizer"
                    @mousedown="(event) => handleColumnResizerMousedown({ event, column, colIndex })"
                  >
                    <div v-if="resizingColumnKey === column.key" class="o-table-column-resizer__indicator"></div>
                  </div>
                </th>
              </template>
            </tr>
          </slot>
        </thead>
        <tbody class="o-table-body" @mousemove="handleMouseOver" @mouseleave="clearHighlight" @touchstart="handleTouchStart">
          <template v-for="(row, rowIndex) in props.data" :key="getRowKey(row, rowIndex)">
            <tr
              :class="[
                'o-table-row',
                'o-table-body-row',
                {
                  [DEFAULT_ROW_LAST_MARKER]: rowIndex === props.data.length - 1 && !isRowExpandable(rowIndex),
                },
              ]"
            >
              <template v-for="(column, colIndex) in dataColumns" :key="column.key">
                <td
                  v-if="!isBodyCellRemoved(rowIndex, colIndex)"
                  v-bind="props.spanMethod?.({ row, column, cellValue: getCellValue({ row, column }), rowIndex, colIndex })"
                  :class="{
                    'o-table-cell': true,
                    'o-table-body-cell': true,
                    'o-cell-last-row': rowIndex === props.data.length - 1 && !isRowExpandable(rowIndex),
                    'o-table-cell-fixed': column.fixed,
                    'o-table-cell-fixed-left': column.fixed === 'left',
                    'o-table-cell-fixed-right': column.fixed === 'right',
                    'o-table-cell-last-left-fixed': isLastLeftFixedCell(rowIndex, colIndex),
                    'o-table-cell-first-right-fixed': isFirstRightFixedCell(rowIndex, colIndex),
                    [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                    [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                  }"
                  :style="getColumnPosition({ column, dataColumns, groupColumns, border: props.border })"
                >
                  <span class="o-table-cell__inner">
                    <OCheckbox
                      v-if="column.isFirstCol && props.selection"
                      v-model="_selectedKeys"
                      :value="getRowKey(row, rowIndex)"
                      class="o-table-row-checkbox"
                      @change="(newVal) => handleRowSelectionChange(getRowKey(row, rowIndex), newVal)"
                    />
                    <IconChevronRight
                      v-if="column.isFirstCol && isTableExpandable.expandable"
                      :class="{
                        'o-table-row-expand-trigger': true,
                        expandable: isRowExpandable(rowIndex),
                        expanded: isRowExpanded(row, rowIndex),
                      }"
                      @click="() => toggleRowExpand(row, rowIndex)"
                    />
                    <slot :name="`td_${column.key}`" :row="row" :column="column" :cell-value="getCellValue({ row, column })" :index="rowIndex">
                      <TableCellRenderer :row="row" :column="column" :cell-value="getCellValue({ row, column })" :row-index="rowIndex" :col-index="colIndex" />
                    </slot>
                  </span>
                </td>
              </template>
            </tr>
            <tr
              v-if="isRowExpandable(rowIndex)"
              v-show="isRowExpanded(row, rowIndex)"
              :class="[
                'o-table-row',
                'o-table-body-row',
                'o-table-row-expand',
                {
                  [DEFAULT_ROW_LAST_MARKER]: rowIndex === props.data.length - 1,
                },
              ]"
            >
              <td
                :colspan="dataColumns.length"
                :class="{
                  'o-table-cell': true,
                  'o-table-body-cell': true,
                  'o-table-expand-cell': true,
                  'o-cell-last-row': rowIndex === props.data.length - 1,
                }"
              >
                <span class="o-table-cell__inner o-table-expand-cell__inner">
                  <slot name="expand" :row="row" :row-index="rowIndex">
                    <component :is="getRenderableComponent(props.expandMethod?.(row, rowIndex))" />
                  </slot>
                </span>
              </td>
            </tr>
          </template>
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

    <div v-if="!hasRightFixedColumn && !props.loading && props.data.length" class="o-data-table-right-shadow"></div>
  </div>
</template>
