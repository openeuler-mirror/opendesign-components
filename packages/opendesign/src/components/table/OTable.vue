<script setup lang="ts">
import { tableProps } from './types';
import { getColumnData, getBodyData } from './table';
import { computed } from 'vue';
import { IconLoading } from '../_shared/icons';
import { isString } from '../_shared/is';

const props = defineProps(tableProps);

// const emits = defineEmits<{}>();

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
      {
        'o-table-small': props.small,
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
        <tbody v-if="tableData.length > 0">
          <slot>
            <tr v-for="(row, rIdx) in tableData" :key="row.key || rIdx">
              <template v-for="(col, cIdx) in row.data" :key="col.key || cIdx">
                <td :rowspan="col.rowspan" :colspan="col.colspan" :class="{ last: col.last }">{{ col.value }}</td>
              </template>
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
