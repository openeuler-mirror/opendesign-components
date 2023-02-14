<script setup lang="ts">
import { ref } from 'vue';
import { OTable } from '../index';
import { getTableData } from './data';

const columns1 = [
  { label: 'Name', key: 'name' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
];
const table1 = {
  columns: columns1,
  data: getTableData(20),
};
const loading = ref(true);
</script>
<template>
  <h4>Basic</h4>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data" />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
