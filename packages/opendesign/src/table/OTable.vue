<script setup lang="ts">
import { tableProps, TableRowT, TableColumnT } from './types';
import { getColumnData, getBodyData } from './table';
import { computed } from 'vue';
import { IconLoading } from '../_utils/icons';
import { isString } from '../_utils/is';
import { useI18n } from '../locale';

const props = defineProps(tableProps);

// type getT<T> = T extends (infer R)[] ? (R extends TableColumnT ? R['key'] : R) : never;
// type keyT = getT<typeof props.columns>;

defineSlots<{
  head(props: { columns: TableColumnT[] }): any;
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
          <slot name="head" :columns="columnData">
            <tr>
              <th v-for="(col, idx) in columnData" :key="col.key || idx" :class="{ last: idx + 1 === columnData.length }">
                <slot :name="`th_${col.key}`" :column="col">
                  {{ col.label }}
                </slot>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody v-if="tableData.length > 0">
          <slot name="body" :body="tableData">
            <tr v-for="(row, rIdx) in tableData" :key="row.key || rIdx" :class="{ last: rIdx + 1 === tableData.length }">
              <td :rowspan="col.rowspan" :colspan="col.colspan" :class="{ last: col.last }" v-for="(col, idx) in row.data" :key="col.key || idx">
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
