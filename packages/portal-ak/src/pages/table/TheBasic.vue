<script setup lang="ts">
import { ref } from 'vue';
import { OTable } from '@components/index';
import { getTableData } from './data';

const columns1 = [
  { label: 'Name', key: 'name' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
];
const table1 = {
  columns: columns1,
  data: getTableData(6),
};
const loading = ref(true);
</script>
<template>
  <h4>尺寸</h4>
  <p>M</p>
  <OTable :columns="table1.columns" :data="table1.data" />

  <p>S</p>
  <OTable :columns="table1.columns" :data="table1.data" small />

  <h4>loading & Empty</h4>
  <OTable :columns="table1.columns" :loading="loading" />
  <br />
  <OTable :columns="table1.columns" />
</template>
<style lang="scss"></style>
