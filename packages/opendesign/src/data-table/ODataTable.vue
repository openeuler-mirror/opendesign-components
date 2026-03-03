<script setup lang="tsx">
import { computed, ref, reactive, provide, markRaw, toRefs, watch, nextTick, shallowRef } from 'vue';
import { useElementBounding, useCssVar, refDebounced } from '@vueuse/core';

import { vOnResize } from '../directives';
import { debounceRAF, getValueByPath, setValueByPath } from '../_utils/helper.ts';
import { checkElementOverflow, findClosestElementWithClass, getCssVariable, isOverflown } from '../_utils/dom.ts';
import { isArray, isFunction, isNil, isNumeric } from '../_utils/is.ts';
import { IconLoading, IconInfoTip } from '../_utils/icons';
import { getRenderableComponent } from '../_utils/vue-utils.ts';
import { OScroller } from '../scrollbar';
import { OCheckbox } from '../checkbox';
import { OPopover } from '../popover';
import { DEFAULT_CELL_FIRST_COL_MARKER, DEFAULT_CELL_LAST_COL_MARKER, TableRowT } from '../table';
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
  DataTableExposed,
} from './types.ts';
import { getColumnPosition, getIsLevelExpandable } from './utils.ts';
import TableColGroup from './TableColGroup.vue';
import TableRow from './TableRow.vue';
import TableColumnFilter from './TableColumnFilter.vue';
import TableColumnSorter from './TableColumnSorter.vue';
import { dataTableInjectKey, DataTableLoadChildrenPayload, dataTableRowInjectKey, DataTableRowKeyMap } from './provide.ts';
import { useDataColumn } from './use-data-column.ts';

const props = defineProps(dataTableProps);
const emits = defineEmits<{
  /** 表格筛选条件更新,如果是排序条件更新则无payload */
  (e: 'condition-update', payload?: DataTableConditionUpdatePayload): void;
  /** 表格列排序更新 */
  (e: 'sort-update', payload: DataTableSortUpdatePayload): void;
  /** 选中双向绑定状态更新 */
  (e: 'update:selected-keys', payload: DataTableRowKeyValue[]): void;
  /** 单行checkbox点击时触发 */
  (e: 'selection', payload: DataTableSelectionPayload): void;
  /** 已选择数据改变时触发 */
  (e: 'selection-change', payload: DataTableSelectionChangePayload): void;
  /** 全选checkbox点击时触发 */
  (e: 'selection-all', allSelected: boolean): void;
  /** 点击懒加载子节点时触发，分别调用resolve与reject表示加载成功或者失败状态 */
  (e: 'load-children', payload: DataTableLoadChildrenPayload): void;
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
const containerWidth = refDebounced(useElementBounding(rootRef).width);

const headerRef = ref<HTMLTableElement>();
const { height: headerTableHeight } = useElementBounding(headerRef);
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
const hasExpandSlot = computed(() => !!slots.expand);
const isLevelExpandable = computed(() => getIsLevelExpandable({ list: props.data, hasExpandSlot, expandMethod: props.expandMethod }));

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

/** 计算数据相关的禁用状态、祖先节点、后代节点等信息 */
const rowKeyMap = computed(() => {
  const _map: DataTableRowKeyMap = new Map();
  const traverse = ({
    row,
    rowIndex,
    ancestorRowKeys,
    setDescendant,
  }: {
    row: TableRowT;
    rowIndex: number;
    ancestorRowKeys: DataTableRowKeyValue[];
    setDescendant?: (descendant: DataTableRowKeyValue) => void;
  }) => {
    const rowKey = getRowKey(row, rowIndex);
    setDescendant?.(rowKey);
    const record = {
      row,
      rowIndex,
      disabled: isNil(props.disabledProp) ? false : !!getValueByPath(row, props.disabledProp),
      ancestorRowKeys,
      descendantRowKeys: [] as DataTableRowKeyValue[],
    };
    const _setDescendant = (descendant: DataTableRowKeyValue) => {
      record.descendantRowKeys.push(descendant);
      setDescendant?.(descendant);
    };
    if (isArray(row.children)) {
      row.children.forEach((v, i) => traverse({ row: v, rowIndex: i, ancestorRowKeys: [rowKey, ...ancestorRowKeys], setDescendant: _setDescendant }));
    }
    _map.set(rowKey, record);
  };
  props.data?.forEach((row, rowIndex) => traverse({ row, rowIndex, ancestorRowKeys: [] }));

  return _map;
});
/** 所有rowKey集合，包含树形节点 */
const allRowKeys = computed(() => {
  return (
    props.data?.reduce<DataTableRowKeyValue[]>((prev, row, rowIndex) => {
      const rowKey = getRowKey(row, rowIndex);
      return [...prev, rowKey, ...(rowKeyMap.value.get(rowKey)?.descendantRowKeys || [])];
    }, []) || []
  );
});
const toFilteredSelectable = (arr: DataTableRowKeyValue[]) => {
  return arr.filter((v) => !rowKeyMap.value.get(v)?.disabled);
};
/** 去掉禁用行后可选择的行的rowKey集合 */
const selectableRowKeys = computed(() => toFilteredSelectable(allRowKeys.value));

const selectedKeys = defineModel<DataTableRowKeyValue[]>('selectedKeys', { default: reactive([]) });

const allChecked = ref<number[]>([]);
const indeterminate = computed(() => {
  return Boolean(
    selectedKeys.value.length &&
      selectableRowKeys.value.some((v) => !selectedKeys.value.includes(v)) &&
      // 兼容数据分页时，selectedKeys中包含非data的key(可能来自于其他分页)
      selectableRowKeys.value.some((v) => selectedKeys.value.includes(v)),
  );
});

const selectionChangedBySelectAll = ref(false);
watch(
  () => [selectedKeys.value, selectableRowKeys.value],
  () => {
    if (selectionChangedBySelectAll.value) {
      selectionChangedBySelectAll.value = false;
      return;
    }
    if (selectedKeys.value.length === selectableRowKeys.value.length) {
      allChecked.value = [1];
    } else if (!selectedKeys.value.length) {
      allChecked.value = [];
    }
  },
  { immediate: true },
);

const handleTableSelection = (key: DataTableRowKeyValue, newVal: DataTableRowKeyValue[]) => {
  emits('selection', { key, selected: !!newVal.length });
};

const handleSelectionAll = (newVal: DataTableRowKeyValue[]) => {
  selectionChangedBySelectAll.value = true;
  emits('selection-all', !!newVal.length);
  const prev = selectedKeys.value;
  selectedKeys.value = newVal.length ? [...selectableRowKeys.value] : [];
  emits('selection-change', { prev, cur: selectedKeys.value });
};

const popoverVisible = ref(false);
const popoverTarget = shallowRef<HTMLElement>();
const popoverContent = ref<string>();
const popoverKey = ref<string>();

const handleTableMouseover = async (e: MouseEvent) => {
  const cellTarget = findClosestElementWithClass(e.target, 'o-table-cell-tooltip', tableEl.value!);

  const cellInnerContent = cellTarget?.querySelector<HTMLSpanElement>(':scope > .o-table-cell__inner > .o-table-cell__inner-content');
  if (cellTarget && cellInnerContent) {
    popoverKey.value = cellTarget.dataset.cellIndex; // 在td上设置的自定义属性
    popoverTarget.value = cellInnerContent;
  }
  if (!cellTarget || cellTarget === tableEl.value || !cellInnerContent || !isOverflown(cellInnerContent)) {
    popoverVisible.value = false;
    popoverTarget.value = undefined;
    popoverContent.value = undefined;
    return;
  }
  await nextTick();
  popoverContent.value = cellInnerContent.innerText;
  popoverVisible.value = true;
};

provide(dataTableInjectKey, {
  ...toRefs(props),
  getRowKey,
  containerWidth,
  dataColumnMap,
  dataColumns,
  groupColumns,

  hasExpandSlot,
  expandedRowKeys,

  isBodyCellRemoved,
  isLastLeftFixedCell,
  isFirstRightFixedCell,

  rowKeyMap,
  allRowKeys,
  toFilteredSelectable,
  selectedKeys,
  handleTableSelection,

  handleLoadChildren(payload) {
    emits('load-children', payload);
  },
});

provide(dataTableRowInjectKey, {
  isLevelExpandable,
});

defineExpose<DataTableExposed>({
  getRowKey,
  dataColumnMap,
  dataColumns,
  groupColumns,
  selectAll() {
    selectedKeys.value = [...selectableRowKeys.value];
  },
  clearAll: () => (selectedKeys.value = []),
  expandAll() {
    expandedRowKeys.value = [...allRowKeys.value];
  },
  foldAll: () => (expandedRowKeys.value = []),
});
</script>

<template>
  <div
    ref="rootRef"
    v-on-resize="checkTableOverflow"
    :class="[
      'o-table',
      `o-table-${props.size}`,
      `o-table-header-${props.headerStyle}`,
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
    <div v-if="props.showHeader && props.headerStyle === 'split-line'" class="o-data-table-header-divider-h"></div>
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
        @mouseover="handleTableMouseover"
      >
        <caption></caption>
        <TableColGroup />
        <thead v-if="props.showHeader" ref="headerRef" class="o-table-header">
          <slot name="header" :columns="dataColumns" :group-columns="groupColumns">
            <tr v-for="(groupColumn, groupIndex) in groupColumns" :key="groupColumn[0]?.key" class="o-table-row o-table-header-row">
              <template v-for="(column, colIndex) in groupColumn" :key="column.key">
                <th
                  v-if="!column.headerHidden"
                  :ref="(el) => setThRef(el, column)"
                  :colspan="column.colSpan || column.customColSpan"
                  :rowspan="column.rowSpan"
                  :class="{
                    'o-table-cell': true,
                    'o-table-header-cell': true,
                    'o-table-column-as-header': column.asHeader,
                    'o-table-cell-tooltip': true,
                    'o-table-last-header-row-cell': !column.children?.length,
                    'o-table-cell-fixed': column.fixed,
                    'o-table-cell-fixed-left': column.fixed === 'left',
                    'o-table-cell-fixed-right': column.fixed === 'right',
                    'o-table-cell-last-left-fixed': column.isLastLeftFixedCol,
                    'o-table-cell-first-right-fixed': column.isFirstRightFixedCol,
                    [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                    [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                  }"
                  :style="{ ...getColumnPosition({ column, dataColumns, groupColumns, border: props.border, isHeader: true }), '--cell-max-row': 1 }"
                  :data-cell-index="`th_${groupIndex}_${colIndex}`"
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
                    <span v-if="column.isFirstCol && !props.selection && isLevelExpandable.expandable" class="o-table-row-icon-placeholder" />
                    <span class="o-table-cell__inner-content">
                      <slot :name="`th_${column.key}`" :column="column">
                        <component :is="getRenderableComponent(column.label)" />
                      </slot>
                    </span>
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
                    <OPopover v-if="column.description" position="top" wrap-class="o-table-tooltip-wrapper">
                      <template #target>
                        <IconInfoTip class="o-data-table-info__trigger" />
                      </template>
                      <component :is="getRenderableComponent(column.description)" />
                    </OPopover>
                  </span>
                  <!-- 如果可调整宽度，且没有合并单元格，则显示 -->
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
            <TableRow :row="row" :row-index="rowIndex" :level="0">
              <template v-if="slots.expand" #expand>
                <slot name="expand" :row="row" :row-index="rowIndex"></slot>
              </template>
            </TableRow>
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
    <OPopover
      v-if="popoverVisible"
      :key="popoverKey"
      visivle
      :target="popoverTarget"
      :position="popoverKey?.startsWith('td') ? 'bottom' : 'top'"
      wrap-class="o-table-tooltip-wrapper"
    >
      {{ popoverContent }}
    </OPopover>
  </div>
</template>
