<script setup lang="ts">
import { OTable } from '../index';
import { getTableData } from './data';

const columns2 = [
  { label: 'No 0', key: 'no' },
  { label: 'Name 1', key: 'name' },
  { label: 'Salary 2', key: 'salary' },
  { label: 'Address 3', key: 'address' },
  { label: 'Email 4', key: 'email' },
  { label: 'Other 5', key: 'other' },
];
const tableData = getTableData(6);

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
