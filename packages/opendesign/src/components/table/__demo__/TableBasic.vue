<script setup lang="ts">
import { ref } from 'vue';
import { OTable } from '../index';

const columns1 = [
  { label: 'Name', key: 'name' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
];
const table1 = {
  columns: columns1,
  data: [
    {
      name: 'Jane Doe',
      salary: 23000,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
    },
    {
      name: 'Alisa Ross',
      salary: 25000,
      address: '35 Park Road, London',
      email: 'alisa.ross@example.com',
    },
    {
      name: 'Kevin Sandra',
      salary: 22000,
      address: '31 Park Road, London',
      email: 'kevin.sandra@example.com',
    },
    {
      name: 'Ed Hellen',
      salary: 17000,
      address: '42 Park Road, London',
      email: 'ed.hellen@example.com',
    },
    {
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
  ],
};
const loading = ref(true);
</script>
<template>
  <h4>Basic</h4>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data" />
  </div>
  <h4>loading & Empty</h4>
  <div class="sec">
    <OTable :columns="table1.columns" :loading="loading" />
    <br />
    <OTable :columns="table1.columns" />
  </div>
  <h4>Style: Border</h4>
  <div class="sec">
    <h5>Border: all</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="all" />
    <h5>Border: row</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="row" />
    <h5>Border: column</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="column" />
    <h5>Border: row-column</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="row-column" />
    <h5>Border: row-frame</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="row-frame" />
    <h5>Border: column-frame</h5>
    <OTable :columns="table1.columns" :data="table1.data" border="column-frame" />
  </div>

  <h4>Style: Small</h4>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data" small />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
