<docs lang="md">
<!--zh-CN-->

### 树形数据

<!--en-US-->

### Tree Data
</docs>

<script setup lang="tsx">
import { computed, ref } from 'vue';
import { DataTableColumnT, ODataTable, OButton, DataTableInstance, DataTableLoadChildrenPayload, useMessage } from '@opensig/opendesign';
import '../../style';
import OSwitch from '../../../switch/OSwitch.vue';

const dataTableRef = ref<DataTableInstance>();

const data = ref([
  { key: '1', name: 'William Smith 1', age: 17, salary: 27001, disabled: true },
  {
    key: '2',
    name: 'Lilian Smith 2',
    age: 19,
    salary: 27002,
    children: [
      { key: '2-1', name: 'William Smith 2-1', age: 21, salary: 27003 },
      {
        key: '2-2',
        name: 'William Smith 2-2',
        age: 21,
        salary: 27003,
        children: [
          {
            key: '2-2-1',
            name: 'William Smith 2-2-1',
            age: 21,
            salary: 27003,
            children: [
              { key: '2-2-1-1', name: 'William Smith 2-2-1-1', age: 21, salary: 27003 },
              { key: '2-2-1-2', name: 'William Smith 2-2-1-2', age: 21, salary: 27003 },
            ],
          },
        ],
      },
    ],
  },
  { key: '3', name: 'Lazy load - failed', age: 21, salary: 27003, hasChildren: true },
  { key: '4', name: 'Lazy load - success', age: 23, salary: 27004, hasChildren: true },
]);

const columns = computed<DataTableColumnT[]>(() => {
  return [
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'Salary', key: 'salary' },
  ];
});

const checkStrictly = ref(true);
const selectedKeys = ref<string[]>(['2-2-1-1']);
const expandedRowKeys = ref<string[]>(['2-2-1']);
const expandAll = () => {
  dataTableRef.value?.expandAll();
};
const foldAll = () => {
  expandedRowKeys.value = [];
};

const handleLoadChildren = ({ rowIndex, rowKey, resolve, reject }: DataTableLoadChildrenPayload) => {
  setTimeout(() => {
    if (rowKey === '4') {
      data.value[rowIndex].children = [
        {
          key: '4-1',
          name: 'Lilian Smith 4-1',
          age: 23,
          salary: 27004,
        },
      ];
      resolve();
    } else {
      useMessage().warning({ content: 'load children failed' });
      reject('load children failed');
    }
  }, 2000);
};
</script>

<template>
  <div class="operations">
    <OButton color="primary" variant="solid" @click="expandAll">expand all</OButton>
    <OButton color="primary" variant="solid" @click="foldAll">fold all</OButton>
    expandedRowKeys: {{ expandedRowKeys }}
  </div>

  <ODataTable
    ref="dataTableRef"
    v-model:expanded-row-keys="expandedRowKeys"
    :columns="columns"
    :data="data"
    row-key="key"
    @load-children="handleLoadChildren"
  />
  <br />
  <div class="operations">checkStrictly: <OSwitch v-model="checkStrictly" /> selectedKeys: {{ selectedKeys }}</div>
  <ODataTable
    v-model:expanded-row-keys="expandedRowKeys"
    v-model:selected-keys="selectedKeys"
    :columns="columns"
    :data="data"
    row-key="key"
    selection
    :check-strictly="checkStrictly"
    @load-children="handleLoadChildren"
  />
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
