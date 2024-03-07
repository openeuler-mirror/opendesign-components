<script setup lang="ts">
import { OTable } from '../index';
import { getTableData } from './data';
import { OLink } from '../../link';
import '../../link/style';

const columns1 = [
  { label: 'Name', key: 'name' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
  { label: 'Action', key: 'action' },
];
const table1 = {
  columns: columns1,
  data: getTableData(6),
};
</script>
<template>
  <h4>Diy</h4>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data">
      <template #th-name="{ item }">diy: {{ item.label }}</template>
      <template #name="{ item }">diy name: {{ item.name }}</template>
      <template #action>
        <OLink color="primary">删除</OLink>
      </template>
    </OTable>
  </div>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data">
      <template #head="{ columns }">
        <th v-for="item in columns" :key="item.key">diy : {{ item.label }}</th>
      </template>
      <template #name="{ item }">diy name: {{ item.name }}</template>
      <template #action>
        <OLink color="primary">删除</OLink>
      </template>
    </OTable>
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
