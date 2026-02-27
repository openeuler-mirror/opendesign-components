<docs lang="md">
<!--zh-CN-->

### 垂直表头

<!--en-US-->

### Column as Header
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { DataTableColumnT, ODataTable } from '@opensig/opendesign';

import { getTableData } from '../../../table/__docs__/__case__/data.ts';

const data = ref(getTableData(5));

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name', width: 200, asHeader: true, fixed: true },
  { label: 'Gender', key: 'gender' },
  { label: 'Age', key: 'age' },
  { label: 'Salary', key: 'salary' },
];
</script>

<template>
  <ODataTable :columns="columns" :data="data" :show-header="false" />
</template>

<style scoped lang="scss"></style>
