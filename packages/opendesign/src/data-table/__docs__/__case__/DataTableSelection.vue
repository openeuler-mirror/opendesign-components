<docs lang="md">
<!--zh-CN-->

### 行选择

<!--en-US-->

### Row Selection
</docs>

<script setup lang="tsx">
import { computed, ref } from 'vue';
import { DataTableColumnT, ODataTable, OButton } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const data = ref(getTableData(3));

const columns = computed<DataTableColumnT[]>(() => {
  return [
    { label: 'Name', key: 'name' },
    { label: 'Gender', key: 'gender' },
    { label: 'Age', key: 'age' },
    { label: 'Salary', key: 'salary' },
  ];
});

const selectedKeys = ref([2]);
const selectAll = () => {
  selectedKeys.value = data.value.map((v) => v.key);
};
const unSelectAll = () => {
  selectedKeys.value = [];
};
</script>

<template>
  <div class="operations">
    <OButton color="primary" variant="solid" @click="selectAll">select all</OButton>
    <OButton color="primary" variant="solid" @click="unSelectAll">unselect all</OButton>

    Selected Keys: {{ selectedKeys }}
  </div>

  <ODataTable v-model:selected-keys="selectedKeys" :columns="columns" :data="data" row-key="key" selection />
</template>

<style lang="scss" scoped>
.operations {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

h4 {
  margin-bottom: 16px;
}
</style>
