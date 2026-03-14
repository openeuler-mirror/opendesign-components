<docs lang="md">
<!--zh-CN-->

### 行展开

<!--en-US-->

### Row Expand
</docs>

<script setup lang="tsx">
import { computed, ref } from 'vue';
import { DataTableColumnT, DataTableExpandMethod, ODataTable, OButton, DataTableInstance } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const dataTableRef = ref<DataTableInstance>();
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

// 通过 expandMethod 可按行控制是否可展开：前3行不可展开，仅第4行可展开并渲染子表格
const expandMethod: DataTableExpandMethod = (row, rowIndex) => {
  if (rowIndex < 3) {
    return false;
  }
  // 返回函数式组件，推荐的 JSX/TSX 渲染方式
  return () => <ODataTable columns={subTableColumns.value} data={[row]} style="width: 100%" />;
};

const expandedRowKeys = ref([2]);
const expandAll = () => {
  dataTableRef.value?.expandAll();
};
const foldAll = () => {
  dataTableRef.value?.foldAll();
};
</script>

<template>
  <div class="operations">
    <OButton color="primary" variant="solid" @click="expandAll">expand all</OButton>
    <OButton color="primary" variant="solid" @click="foldAll">fold all</OButton>
    expandedRowKeys: {{ expandedRowKeys }}
  </div>

  <h4>By Method</h4>
  <ODataTable ref="dataTableRef" v-model:expanded-row-keys="expandedRowKeys" :columns="columns" :data="data" :expand-method="expandMethod" row-key="key" />
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
  align-items: center;
}

h4 {
  margin-bottom: 16px;
}
</style>
