<script setup lang="ts">
import { TableColumnT, TableRowT, ColumnKeysT, CellSpanT, TableBorderT } from './types';
import { getColumnData, getBodyData } from './table';
import { computed } from 'vue';
import { IconLoading } from '../_shared/icons';
import { isString } from '../_shared/utils';

interface TablePropT {
  /**
   * 表头内容
   */
  columns?: TableColumnT[] | string[];
  /**
   * 表头内容
   */
  columnKeys?: ColumnKeysT;
  /**
   * 表格数据
   */
  data?: TableRowT[];
  /**
   * 是否显示边框
   */
  border?: TableBorderT;
  /**
   * 是否小表格
   */
  small?: boolean;
  /**
   * 处理单元格合并(表体部分，不包含表头)
   */
  cellSpan?: CellSpanT;
  /**
   * 空数据提示文本
   */
  emptyLabel?: string;
  /**
   * 是否正在加载
   */
  loading?: boolean;
  /**
   * 加载提示文本
   */
  loadingLabel?: string;
}

const props = withDefaults(defineProps<TablePropT>(), {
  small: false,
  cellSpan: undefined,
  columns: undefined,
  columnKeys: undefined,
  data: undefined,
  emptyLabel: '',
  loadingLabel: '',
  border: 'row',
});

const columnData = computed(() => getColumnData(props.columns));

const tableData = computed(() => getBodyData(columnData, props.data, props.cellSpan));

const emptyLabel = props.emptyLabel || '无数据';
const loadingLabel = props.loadingLabel || '正在加载...';

const boderClass = computed(() => {
  if (isString(props.border)) {
    return props.border.split('-').map((item) => `o-table-border-${item}`);
  }
  return '';
});
</script>
<template>
  <div
    class="o-table"
    :class="[
      boderClass,
      {
        'is-small': props.small,
      },
    ]"
  >
    <table>
      <colgroup>
        <col v-for="col in columnData" :key="col.key" :style="col.style" />
      </colgroup>
      <thead v-if="columnData.length > 1">
        <slot name="head">
          <th v-for="(col, idx) in columnData" :key="col.key || idx" :class="{ last: idx + 1 === columnData.length }">{{ col.label }}</th>
        </slot>
      </thead>
      <tbody v-if="!props.loading && tableData.length > 0">
        <slot>
          <tr v-for="(row, rIdx) in tableData" :key="row.key || rIdx">
            <template v-for="(col, cIdx) in row.data" :key="col.key || cIdx">
              <td :rowspan="col.rowspan" :colspan="col.colspan" :class="{ last: col.last }">{{ col.value }}</td>
            </template>
          </tr>
        </slot>
      </tbody>
    </table>
    <div v-if="props.loading" class="o-table-tip-wrap">
      <slot name="loading">
        <IconLoading class="o-rotating" />
        <div class="o-table-loading-label">{{ loadingLabel }}</div>
      </slot>
    </div>
    <div v-else-if="tableData.length === 0" class="o-table-tip-wrap">
      <slot name="empty">
        <div class="o-table-empty-label">{{ emptyLabel }}</div>
      </slot>
    </div>
  </div>
</template>
