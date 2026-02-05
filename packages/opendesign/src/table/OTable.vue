<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

import { IconLoading } from '../_utils/icons';
import { tableProps, TableRowT, TableColumnT } from './types';
import { getColumnData, getBodyData } from './table';
import { DEFAULT_CELL_LAST_COL_MARKER, DEFAULT_ROW_LAST_MARKER } from './useTableMeta';
import { useTableCommon } from './useTableCommon';

const props = defineProps(tableProps);

defineSlots<{
  header(props: { columns: TableColumnT[] }): any;
  body(): any;
  empty(): any;
  loading(): any;
  [k: `th_${string}`]: (props: { column: TableColumnT }) => any;
  [k: `td_${string}`]: (props: { row: TableRowT; rowIndex: number }) => any;
}>();

const columnData = computed(() => getColumnData(props.columns));

const tableData = computed(() => getBodyData(columnData, props.data, props.cellSpan));

const tableEl = ref<HTMLTableElement>();

const { emptyLabel, loadingLabel, borderClass, handleMouseOver, clearHighlight, handleTouchStart } = useTableCommon({ ...toRefs(props), tableEl });
</script>
<template>
  <div
    class="o-table"
    :class="[
      {
        'o-table-stripe': props.stripe,
        'o-table-small': props.small,
        'o-table-medium': !props.small,
      },
    ]"
  >
    <div class="o-table-wrap" :class="borderClass">
      <table ref="tableEl">
        <colgroup>
          <col v-for="col in columnData" :key="col.key" :style="col.style" />
        </colgroup>
        <thead v-if="columnData.length > 1">
          <slot name="header" :columns="columnData">
            <tr>
              <th v-for="(col, idx) in columnData" :key="col.key || idx" :class="{ [DEFAULT_CELL_LAST_COL_MARKER]: idx + 1 === columnData.length }">
                <slot :name="`th_${col.key}`" :column="col">
                  {{ col.label }}
                </slot>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody v-if="tableData.length > 0" @mousemove="handleMouseOver" @mouseleave="clearHighlight" @touchstart="handleTouchStart">
          <slot name="body" :body="tableData">
            <tr v-for="(row, rIdx) in tableData" :key="row.key || rIdx" :class="{ [DEFAULT_ROW_LAST_MARKER]: rIdx + 1 === tableData.length }">
              <td
                v-for="(col, idx) in row.data"
                :key="col.key || idx"
                :rowspan="col.rowspan"
                :colspan="col.colspan"
                :class="{ [DEFAULT_CELL_LAST_COL_MARKER]: col.last }"
              >
                <slot :name="`td_${col.key}`" :row="props.data ? props.data[rIdx] : {}" :row-index="rIdx">
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
