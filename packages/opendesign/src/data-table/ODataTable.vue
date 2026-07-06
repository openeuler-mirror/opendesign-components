<script setup lang="tsx">
import { computed, ref, reactive, provide, markRaw, toRefs, watch, nextTick, shallowRef } from 'vue';
import { useElementBounding, useCssVar, refDebounced } from '@vueuse/core';

import { vOnResize } from '../directives';
import { debounceRAF, getValueByPath, setValueByPath } from '../_utils/helper.ts';
import { checkElementOverflow, findClosestElementWithClass, getCssVariable, isOverflown } from '../_utils/dom.ts';
import { isArray, isFunction, isNil, isNumber, isNumeric } from '../_utils/is.ts';
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
  DataTableRowSlots,
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
  /**
   * @zh-CN 表格筛选条件更新，如果是排序条件更新则无 payload
   * @en-US Table filter condition updated; no payload if it's a sort condition update
   * @since 1.2.2
   */
  (e: 'condition-update', payload?: DataTableConditionUpdatePayload): void;
  /**
   * @zh-CN 表格列排序更新
   * @en-US Table column sort updated
   * @since 1.2.2
   */
  (e: 'sort-update', payload: DataTableSortUpdatePayload): void;
  /**
   * @zh-CN 选中行双向绑定状态更新
   * @en-US Selected rows binding state updated
   * @since 1.2.2
   */
  (e: 'update:selected-keys', payload: DataTableRowKeyValue[]): void;
  /**
   * @zh-CN 单行 checkbox 点击时触发
   * @en-US Triggered when a single row checkbox is clicked
   * @since 1.2.2
   */
  (e: 'selection', payload: DataTableSelectionPayload): void;
  /**
   * @zh-CN 已选择数据改变时触发
   * @en-US Triggered when the selected data changes
   * @since 1.2.2
   */
  (e: 'selection-change', payload: DataTableSelectionChangePayload): void;
  /**
   * @zh-CN 全选 checkbox 点击时触发
   * @en-US Triggered when the select-all checkbox is clicked
   * @since 1.2.2
   */
  (e: 'selection-all', allSelected: boolean): void;
  /**
   * @zh-CN 点击懒加载子节点时触发，分别调用 resolve 与 reject 表示加载成功或失败状态
   * @en-US Triggered when a lazy-load child node is clicked; call resolve or reject to indicate success or failure
   * @since 1.2.2
   */
  (e: 'load-children', payload: DataTableLoadChildrenPayload): void;
  /**
   * @zh-CN 列宽调整
   * @en-US Column width resized
   * @since 1.2.2
   */
  (e: 'column-resize', column: EffectiveDataTableColumnT, width: number): void;
}>();

type AllSlots = {
  /**
   * @zh-CN thead插槽
   * @en-US Thead slot
   */
  header?: (options: { columns: EffectiveDataTableColumnT[]; groupColumns: EffectiveDataTableColumnT[][] }) => any;
  /**
   * @zh-CN 加载状态插槽
   * @en-US Loading state slot
   */
  loading?: () => any;
  /**
   * @zh-CN 空状态插槽
   * @en-US Empty state slot
   */
  empty?: () => any;
} & DataTableRowSlots &
  Record<`th_${string}`, (options: { column: EffectiveDataTableColumnT }) => any>;

const slots = defineSlots<AllSlots>();

// 收集以 td_ 为前缀的具名插槽，透传给 TableRow 用于自定义单元格渲染
const tdSlotNames = computed(() => Object.keys(slots).filter((name): name is `td_${string}` => name.startsWith('td_')));

const rootRef = ref<HTMLDivElement>();
const { width: containerBoundingWidth } = useElementBounding(rootRef);
// 使用 clientWidth 排除边框宽度，避免百分比列宽转换时因包含border而溢出
const containerWidth = refDebounced(
  computed(() => {
    void containerBoundingWidth.value;
    return rootRef.value?.clientWidth ?? 0;
  }),
);

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
 * @since 1.2.2
 */
const expandedRowKeys = defineModel<DataTableRowKeyValue[]>('expanded-row-keys', { default: () => reactive([]) });
const hasExpandSlot = computed(() => !!slots.expand);
const isLevelExpandable = computed(() => getIsLevelExpandable({ list: props.data, hasExpandSlot, expandMethod: props.expandMethod }));

/**
 * @zh-CN 表格筛选条件
 * @en-US Table filter conditions
 * @since 1.2.2
 */
const conditions = defineModel<Record<string, unknown>>('conditions', {
  /**
   * @important 兜底如果外面没有传值的情况
   */
  default: () => reactive({}),
});

/**
 * @zh-CN 排序条件的操作序列，数组顺序即用户点击的先后顺序；新增追加末尾，取消移除，切换方向位置不变，取消后再次赋予追加末尾；优先级由调用者自行解读
 * @en-US The sequence of sort condition activations; array order reflects the order of user clicks. New conditions appended, cancelled removed, direction-only changes stay in place, re-activated after cancellation appended. Sort priority interpretation is up to the caller
 * @since 1.2.5
 */
const sortSequence = defineModel<string[]>('sortSequence', {
  /**
   * @important 兜底如果外面没有传值的情况
   */
  default: () => reactive([]),
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

/**
 * @description 处理排序条件变更，维护 sortSequence 操作序列
 * - 两种模式都需要设置当前列排序值并维护 sortSequence
 * - 单条件排序额外清空其他列的排序条件，sortSequence 仅保留当前列
 * - sortSequence 维护规则：新增追加末尾、取消移除、仅切换方向时位置不变、取消后再次赋予追加末尾
 * @param {string} key - 排序条件对应的 sortKey
 * @param {DataTableSortMethodT} newVal - 新的排序方向
 */
const handleTableSorterChange = (key?: string, newVal?: DataTableSortMethodT) => {
  if (!key) {
    return;
  }
  let _sortSequence = [...sortSequence.value];
  // 单条件排序：清空其他列的排序条件，sortSequence 仅保留当前列
  if (props.sortMode === 'single') {
    sortKeys.value.forEach((_key) => {
      setValueByPath(conditions.value, _key, DataTableSortMethod.NA);
    });
    _sortSequence = [key];
  }

  setValueByPath(conditions.value, key, newVal);

  // 维护 sortSequence 操作序列（两种模式都需要）
  if (newVal === DataTableSortMethod.NA) {
    // 取消排序时，从序列中移除
    _sortSequence = _sortSequence.filter((k) => k !== key);
  } else if (!_sortSequence.includes(key)) {
    _sortSequence.push(key);
  }
  sortSequence.value = _sortSequence;

  emits('condition-update');
  emits('sort-update', { key, newVal, sortSequence: [..._sortSequence] });
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

/**
 * @zh-CN 选中行的rowKey集合
 * @en-US Selected row keys collection
 * @since 1.2.2
 */
const selectedKeys = defineModel<DataTableRowKeyValue[]>('selectedKeys', { default: () => reactive([]) });

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
  /**
   * @zh-CN 全选
   * @en-US Select all
   * @since 1.2.2
   */
  selectAll() {
    selectedKeys.value = [...selectableRowKeys.value];
  },
  /**
   * @zh-CN 清空全选
   * @en-US Clear all selections
   * @since 1.2.2
   */
  clearAll: () => (selectedKeys.value = []),
  /**
   * @zh-CN 展开全部
   * @en-US Expand all rows
   * @since 1.2.2
   */
  expandAll() {
    expandedRowKeys.value = [...allRowKeys.value];
  },
  /**
   * @zh-CN 收起全部
   * @en-US Fold all rows
   * @since 1.2.2
   */
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
                    'o-table-cell-tooltip': column.showHeaderOverflowToolTip !== false && column.showHeaderOverflowToolTip !== 0,
                    'o-table-cell-wrappable': isNumber(column.showHeaderOverflowToolTip) && column.showHeaderOverflowToolTip > 1,
                    'o-table-last-header-row-cell': !column.children?.length,
                    'o-table-cell-fixed': column.fixed,
                    'o-table-cell-fixed-left': column.fixed === 'left',
                    'o-table-cell-fixed-right': column.fixed === 'right',
                    'o-table-cell-last-left-fixed': column.isLastLeftFixedCol,
                    'o-table-cell-first-right-fixed': column.isFirstRightFixedCol,
                    [DEFAULT_CELL_FIRST_COL_MARKER]: column.isFirstCol,
                    [DEFAULT_CELL_LAST_COL_MARKER]: column.isLastCol,
                  }"
                  :style="{
                    ...getColumnPosition({ column, dataColumns, groupColumns, border: props.border, isHeader: true }),
                    '--cell-max-row': isNumber(column.showHeaderOverflowToolTip) ? column.showHeaderOverflowToolTip : 1,
                  }"
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
              <template v-for="name in tdSlotNames" :key="name" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps"></slot>
              </template>
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
