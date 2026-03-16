<script setup lang="ts">
import { computed, inject, provide, ref, toRefs, watch } from 'vue';

import { DEFAULT_CELL_FIRST_COL_MARKER, DEFAULT_CELL_LAST_COL_MARKER, DEFAULT_ROW_LAST_MARKER, TableRowT } from '../table';
import { getRenderableComponent } from '../_utils/vue-utils.ts';
import { OCheckbox } from '../checkbox';
import { IconChevronRightSmall, IconLoadingSmall } from '../_utils/icons.ts';
import { isArray, isNil, isNumber } from '../_utils/is.ts';
import { promiseWithResolvers } from '../_utils/helper.ts';

import TableCellRenderer from './TableCellRenderer.vue';
import { dataTableInjectKey, dataTableRowInjectKey } from './provide.ts';
import { getCellValue, getColumnPosition, getIsLevelExpandable } from './utils.ts';
import { DataTableRowKeyValue } from './types.ts';

type ExpandByT = 'expand' | 'children';

const props = defineProps<{
  row: TableRowT;
  rowIndex: number;
  // 当前行的层级
  level: number;
}>();
const { row, rowIndex, level } = toRefs(props);

const {
  getRowKey,
  data,
  border,
  headerStyle,
  spanMethod,
  selection,
  checkStrictly,
  dataColumns,
  groupColumns,

  hasExpandSlot,
  expandMethod,
  expandedRowKeys,

  isBodyCellRemoved,
  isLastLeftFixedCell,
  isFirstRightFixedCell,

  rowKeyMap,
  toFilteredSelectable,
  selectedKeys,
  handleTableSelection,

  handleLoadChildren,
} = inject(dataTableInjectKey)!;

const { isLevelExpandable } = inject(dataTableRowInjectKey)!;

const rowKey = computed(() => getRowKey(row.value, rowIndex.value));
const expandBy = computed<ExpandByT>(() => {
  if (hasExpandSlot.value || !isNil(expandMethod?.value)) {
    return 'expand';
  }
  return 'children';
});

const indeterminate = computed(() => {
  if (checkStrictly.value || selectedKeys.value.includes(rowKey.value)) {
    return undefined;
  }
  const { descendantRowKeys } = rowKeyMap.value.get(rowKey.value)!;
  const selectableDescendantRowKeys = toFilteredSelectable(descendantRowKeys);
  const someChecked = selectableDescendantRowKeys.some((v) => selectedKeys.value.includes(v));
  const someUncheck = selectableDescendantRowKeys.some((v) => !selectedKeys.value.includes(v));

  return someChecked && someUncheck;
});

const handleRowSelection = (newVal: DataTableRowKeyValue[]) => {
  if (checkStrictly.value) {
    return;
  }
  const { ancestorRowKeys, descendantRowKeys } = rowKeyMap.value.get(rowKey.value)!;
  let _selectedKeys = selectedKeys.value.filter((v) => !descendantRowKeys.includes(v));
  // 若是选中则孩子全选中
  if (newVal.includes(rowKey.value)) {
    _selectedKeys.push(...toFilteredSelectable(descendantRowKeys));
  } else {
    _selectedKeys = _selectedKeys.filter((v) => !descendantRowKeys.includes(v));
  }
  // 处理父路径情况
  ancestorRowKeys.forEach((v) => {
    const { descendantRowKeys: ancestorDescendantRowKeys } = rowKeyMap.value.get(v)!;
    if (toFilteredSelectable(ancestorDescendantRowKeys).every((x) => _selectedKeys.includes(x))) {
      _selectedKeys.push(v);
    } else {
      _selectedKeys = _selectedKeys.filter((x) => x !== v);
    }
  });
  selectedKeys.value = Array.from(new Set(_selectedKeys));
  handleTableSelection(rowKey.value, newVal);
};

const expandLoading = ref(false);
const isRowExpandable = computed(() => {
  if (!isLevelExpandable.value.expandable) {
    return false;
  }
  return isLevelExpandable.value.expandableRowIndexes.includes(rowIndex.value);
});
const isRowExpanded = computed(() => expandedRowKeys.value.includes(rowKey.value));
const toggleRowExpand = () => {
  const index = expandedRowKeys.value.findIndex((v) => v === rowKey.value);
  if (index !== -1) {
    expandedRowKeys.value.splice(index, 1);
    return;
  }
  expandedRowKeys.value.push(rowKey.value);
};

watch(
  expandedRowKeys,
  () => {
    const index = expandedRowKeys.value.findIndex((v) => v === rowKey.value);
    if (index === -1) {
      return;
    }
    if (!isArray(row.value.children) && row.value.children) {
      return;
    }
    if (!row.value.hasChildren || row.value.children?.length) {
      return;
    }

    const { reject, resolve, promise } = promiseWithResolvers<void>();
    expandLoading.value = true;
    handleLoadChildren({ row: row.value, rowIndex: rowIndex.value, rowKey: rowKey.value, reject, resolve });
    promise.catch(() => expandedRowKeys.value.splice(index, 1)).finally(() => (expandLoading.value = false));
  },
  { deep: true },
);

provide(dataTableRowInjectKey, {
  isLevelExpandable: computed(() => getIsLevelExpandable({ list: row.value.children, hasExpandSlot, expandMethod: expandMethod?.value })),
});
</script>

<template>
  <tr
    :class="[
      'o-table-row',
      'o-table-body-row',
      {
        [DEFAULT_ROW_LAST_MARKER]: rowIndex === data.length - 1 && !isRowExpandable,
        'o-table-row-disabled': rowKeyMap.get(rowKey)?.disabled,
      },
    ]"
    :data-level="level"
  >
    <template v-for="(column, colIndex) in dataColumns" :key="column.key">
      <td
        v-if="!isBodyCellRemoved(rowIndex, colIndex)"
        v-bind="spanMethod?.({ row, column, cellValue: getCellValue({ row, column }), rowIndex, colIndex })"
        :class="{
          'o-table-cell': true,
          'o-table-body-cell': true,
          'o-table-column-as-header': column.asHeader,
          'o-cell-last-row': rowIndex === data.length - 1 && !isRowExpandable,
          'o-table-cell-fixed': column.fixed,
          'o-table-cell-fixed-left': column.fixed === 'left',
          'o-table-cell-fixed-right': column.fixed === 'right',
          'o-table-cell-last-left-fixed': isLastLeftFixedCell(rowIndex, colIndex),
          'o-table-cell-first-right-fixed': isFirstRightFixedCell(rowIndex, colIndex),
          [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
          [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
          'o-table-cell-tooltip': column.showOverflowToolTip,
        }"
        :style="{
          ...getColumnPosition({
            column,
            dataColumns,
            groupColumns,
            border: border,
            colSpan: spanMethod?.({ row, column, cellValue: getCellValue({ row, column }), rowIndex, colIndex })?.colSpan,
          }),
          '--cell-max-row': isNumber(column.showOverflowToolTip) ? column.showOverflowToolTip : 1,
        }"
        :data-cell-index="`td_${rowIndex}_${colIndex}`"
      >
        <span class="o-table-cell__inner">
          <OCheckbox
            v-if="column.isFirstCol && selection"
            v-model="selectedKeys"
            :indeterminate="indeterminate"
            :value="getRowKey(row, rowIndex)"
            :disabled="rowKeyMap.get(rowKey)?.disabled"
            class="o-table-row-checkbox"
            @change="handleRowSelection"
          />
          <template v-if="column.isFirstCol">
            <span v-if="level > 0 && !isLevelExpandable.expandable" class="o-table-row-icon-placeholder" />
            <span v-for="i in level" :key="i" class="o-table-row-icon-placeholder" />
          </template>
          <template v-if="column.isFirstCol && isLevelExpandable.expandable">
            <IconLoadingSmall v-if="expandLoading" class="o-rotating o-table-row-expand-trigger loading" />
            <IconChevronRightSmall
              v-else
              :class="{
                'o-table-row-expand-trigger': true,
                expandable: isRowExpandable,
                expanded: isRowExpanded,
              }"
              @click="toggleRowExpand"
            />
          </template>
          <TableCellRenderer :row="row" :column="column" :cell-value="getCellValue({ row, column })" :row-index="rowIndex" :col-index="colIndex" />
        </span>
        <div v-if="headerStyle === 'split-line' && column.asHeader" class="o-data-table-header-divider-v"></div>
      </td>
    </template>
  </tr>
  <tr
    v-if="isRowExpandable && expandBy === 'expand' && isRowExpanded"
    :class="[
      'o-table-row',
      'o-table-body-row',
      'o-table-row-expand',
      {
        [DEFAULT_ROW_LAST_MARKER]: rowIndex === data.length - 1,
      },
    ]"
  >
    <td
      :colspan="dataColumns.length"
      :class="{
        'o-table-cell': true,
        'o-table-body-cell': true,
        'o-table-expand-cell': true,
        'o-cell-last-row': rowIndex === data.length - 1,
      }"
    >
      <span class="o-table-cell__inner o-table-expand-cell__inner">
        <slot name="expand" :row="row" :row-index="rowIndex">
          <component :is="getRenderableComponent(expandMethod?.(row, rowIndex))" />
        </slot>
      </span>
    </td>
  </tr>
  <template v-else-if="isArray(row.children) && row.children.length && isRowExpanded">
    <TableRow v-for="(child, childIndex) in row.children" :key="getRowKey(child, childIndex)" :row="child" :row-index="childIndex" :level="level + 1">
      <template #expand>
        <slot name="expand" :row="child" :row-index="childIndex"></slot>
      </template>
    </TableRow>
  </template>
</template>

<style scoped lang="scss"></style>
