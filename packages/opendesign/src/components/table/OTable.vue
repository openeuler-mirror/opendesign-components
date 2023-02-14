<script setup lang="ts">
import { TableColumnT, TableRowT, ColumnKeysT, CellSpanT, TableBorderT } from './types';
import { getColumnData, getBodyData } from './table';
import { computed, ref } from 'vue';
import { IconLoading } from '../_shared/icons';
import { isString } from '../_shared/is';
import { OPagination, PaginationPropT, defaultPageSizes } from '../pagination';

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
  /**
   * 页码配置
   */
  pagination?: PaginationPropT | false;
}

const props = withDefaults(defineProps<TablePropT>(), {
  columns: undefined,
  columnKeys: undefined,
  data: undefined,
  small: false,
  cellSpan: undefined,
  border: 'row',
  emptyLabel: '',
  loadingLabel: '',
  pagination: undefined,
});

const columnData = computed(() => getColumnData(props.columns));

const currentPage = ref(props.pagination ? props.pagination.currentPage ?? 1 : 1);

const pageSize = computed(() => {
  if (props.pagination === false) {
    return props.data?.length ?? 0;
  } else {
    return props.pagination?.pageSize ?? defaultPageSizes[0];
  }
});
const currentPageSize = ref(pageSize.value);

const totalCount = computed(() => props.data?.length ?? 0);

const pagination = computed<PaginationPropT | false>(() => {
  if (props.pagination === false) {
    return false;
  }

  return {
    ...props.pagination,
    total: props.data?.length,
  };
});

const showPagination = computed(() => {
  if (pagination.value === false || props.loading || !props.data || props.data.length === 0) {
    return false;
  }
  console.log(pagination.value);

  return totalCount.value > pageSize.value;
});

const tableData = computed(() => getBodyData(columnData, props.data, currentPage.value, currentPageSize.value, props.cellSpan));

const emptyLabel = props.emptyLabel || '无数据';
const loadingLabel = props.loadingLabel || '正在加载...';

const boderClass = computed(() => {
  if (isString(props.border)) {
    return props.border.split('-').map((item) => `o-table-border-${item}`);
  }
  return '';
});

const onPageChange = ({ current, size }: { current: number; size: number }) => {
  currentPage.value = current;
  currentPageSize.value = size;
};
</script>
<template>
  <div
    class="o-table"
    :class="[
      {
        'is-small': props.small,
      },
    ]"
  >
    <div class="o-table-wrap" :class="boderClass">
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
      <div v-else-if="!props.data || props.data.length === 0" class="o-table-tip-wrap">
        <slot name="empty">
          <div class="o-table-empty-label">{{ emptyLabel }}</div>
        </slot>
      </div>
    </div>
    <div v-if="showPagination" class="o-table-pagination-wrap">
      <OPagination v-bind="pagination" ref="paginationRef" class="o-table-pagination" @change="onPageChange" />
    </div>
  </div>
</template>
