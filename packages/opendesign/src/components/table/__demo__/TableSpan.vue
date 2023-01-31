<script setup lang="ts">
import { OTable } from '../index';

const columns2 = [
  { label: 'No 0', key: 'no' },
  { label: 'Name 1', key: 'name' },
  { label: 'Salary 2', key: 'salary' },
  { label: 'Address 3', key: 'address' },
  { label: 'Email 4', key: 'email' },
  { label: 'Other 5', key: 'other' },
];
const tableData = [
  {
    no: 0,
    key: 1,
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
    other: 'other info',
  },
  {
    no: 1,
    key: 2,
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
    other: 'other info',
  },
  {
    no: 2,
    key: 3,
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
    other: 'other info',
  },
  {
    no: 3,
    key: 4,
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com',
    other: 'other info',
  },
  {
    no: 4,
    key: 5,
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com',
    other: 'other info',
  },
];

function cellSpanFn(rowIdx: number, colIdx: number) {
  if (rowIdx === 2 && colIdx === 2) {
    return {
      rowspan: 2,
      // colspan: 2,
    };
  }
  if (rowIdx === 0 && colIdx === 0) {
    return {
      rowspan: 2,
      colspan: 2,
    };
  }

  if (rowIdx === 0 && colIdx === 4) {
    return {
      rowspan: 2,
    };
  }

  if (rowIdx === 2 && colIdx === 5) {
    return {
      rowspan: 2,
    };
  }
}
</script>
<template>
  <h4>单元格合并</h4>
  <div class="sec">
    <OTable border="all" :data="tableData" :columns="columns2" :cell-span="cellSpanFn" />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
