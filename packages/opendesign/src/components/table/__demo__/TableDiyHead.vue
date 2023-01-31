<script setup lang="ts">
import { OTable } from '../index';

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

const tableData = [
  {
    key: 1,
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
    other: 'other',
  },
  {
    key: 2,
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
    other: 'other',
  },
  {
    key: 3,
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
    other: 'other',
  },
  {
    key: 4,
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com',
    other: 'other',
  },
  {
    key: 5,
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com',
    other: 'other',
  },
];
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
