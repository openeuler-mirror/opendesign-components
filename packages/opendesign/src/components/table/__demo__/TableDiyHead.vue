<script setup lang="ts">
import { OTable } from '../index';
import { getTableData } from './data';

interface ColItemT {
  label: string;
  key: string;
  rowspan?: number;
  colspan?: number;
  last?: boolean;
}
const columns1: ColItemT[][] = [
  [
    { label: 'Name', key: 'name', rowspan: 2 },
    { label: 'Info', key: 'info', colspan: 3 },
    { label: 'Other', key: 'other', rowspan: 2, last: true },
  ],
  [
    { label: 'Salary', key: 'salary' },
    { label: 'Address', key: 'address' },
    { label: 'Email', key: 'email' },
  ],
];
const columnKeys = ['name', 'salary', 'address', 'email', 'other'];

const tableData = getTableData(20);
</script>
<template>
  <h4>自定义表头</h4>
  <div class="sec">
    <OTable :data="tableData" :columns="columnKeys">
      <template #head>
        <tr v-for="(row, idx) in columns1" :key="idx">
          <th v-for="col in row" :key="col.key" :rowspan="col.rowspan" :colspan="col.colspan" :class="{ last: col.last }">
            {{ col.label }}
          </th>
        </tr>
      </template>
    </OTable>
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
