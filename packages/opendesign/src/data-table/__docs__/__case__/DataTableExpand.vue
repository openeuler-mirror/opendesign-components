<docs lang="md">
<!--zh-CN-->

### 行展开

<!--en-US-->

### Row Expand
</docs>

<script setup lang="tsx">
import { computed, ref } from 'vue';
import { DataTableColumnT, DataTableExpandMethod, ODataTable, OButton } from '@opensig/opendesign';
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

const subTableColumns = computed<DataTableColumnT[]>(() => {
  return [
    { label: 'Address', key: 'address' },
    { label: 'Email', key: 'email' },
  ];
});

const expandMethod: DataTableExpandMethod = (row, rowIndex) => {
  if (rowIndex < 3) {
    return false;
  }
  return () => <ODataTable columns={subTableColumns.value} data={[row]} style="width: 100%" />;
};

const expandedRowKeys = ref([2]);
const expandAll = () => {
  expandedRowKeys.value = data.value.map((v) => v.key);
};
const foldAll = () => {
  expandedRowKeys.value = [];
};
</script>

<template>
  <div class="operations">
    <OButton color="primary" variant="solid" @click="expandAll">expand all</OButton>
    <OButton color="primary" variant="solid" @click="foldAll">fold all</OButton>
  </div>

  <h4>By Method</h4>
  <ODataTable v-model:expanded-row-keys="expandedRowKeys" :columns="columns" :data="data" :expand-method="expandMethod" row-key="key" />
  <h4>By Slot</h4>
  <ODataTable v-model:expanded-row-keys="expandedRowKeys" :columns="columns" :data="data" row-key="key">
    <template #expand="{ row }">
      <ODataTable :columns="subTableColumns" :data="[row]" style="width: 100%" />
    </template>
  </ODataTable>
</template>

<style lang="scss" scoped>
.operations {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

h4 {
  margin-bottom: 16px;
}
</style>
