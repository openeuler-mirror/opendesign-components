<docs lang="md">
<!--zh-CN-->
### Diy

<!--en-US-->
### Diy
</docs>

<script setup lang="ts">
import { OTable, OLink } from '@opensig/opendesign';
import { getTableData } from './data';

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
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data">
      <template #th_name="{ column }">diy: {{ column.label }}</template>
      <template #td_name="{ row }">diy name: {{ row.name }}</template>
      <template #action>
        <OLink color="primary">删除</OLink>
      </template>
    </OTable>
  </div>
  <div class="sec">
    <OTable :columns="table1.columns" :data="table1.data">
      <template #header="{ columns }">
        <th v-for="item in columns" :key="item.key">diy : {{ item.label }}</th>
      </template>
      <template #td-name="{ row }">diy name: {{ row.name }}</template>
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
