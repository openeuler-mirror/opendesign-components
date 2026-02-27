<docs lang="md">
<!--zh-CN-->

### 线分割表头风格

<!--en-US-->

### Split line Header Style
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { DataTableColumnT, ODataTable } from '@opensig/opendesign';

import { getTableData } from '../../../table/__docs__/__case__/data.ts';

const data = ref(getTableData(5));

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name', width: 200 },
  { label: 'Gender', key: 'gender' },
  { label: 'Age', key: 'age' },
  { label: 'Salary', key: 'salary' },
];
</script>

<template>
  <ODataTable :columns="columns" :data="data" header-style="split-line" />
</template>

<style scoped lang="scss"></style>
