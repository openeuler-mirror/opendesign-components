<docs lang="md">
<!--zh-CN-->

### 分页 + 筛选排序

展示后端分页与筛选排序联动的两种请求模式：事件驱动与 watch 自动请求。

<!--en-US-->

### Pagination + Filter & Sort

Demonstrates two request patterns for backend pagination with filtering and sorting: event-driven and watch auto-request.
</docs>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  DataTableColumnT,
  DataTableSortMethod,
  DataTableSortMethodT,
} from '@opensig/opendesign';
import { requestTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const columns = computed<DataTableColumnT[]>(() => [
  {
    label: 'Name',
    key: 'name',
    filter: {
      multiple: true,
      optionTitle: 'Select Name',
      optionsFn() {
        return [
          { label: 'William Smith', value: 'William' },
          { label: 'Lilian Smith', value: 'Lilian' },
        ];
      },
    },
  },
  {
    label: 'Age',
    key: 'age',
    sortKey: 'ageSort',
  },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
]);

const conditions = ref<{ name: string[]; ageSort?: DataTableSortMethodT }>({
  name: [],
  ageSort: DataTableSortMethod.NA,
});

const loading = ref(false);
const data = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(5);

// 竞态控制：丢弃过期请求的响应
let fetchVersion = 0;

const fetchData = async () => {
  loading.value = true;
  const version = ++fetchVersion;
  try {
    const cursor = (currentPage.value - 1) * pageSize.value;
    const res = await requestTableData(cursor, pageSize.value);
    if (version !== fetchVersion) return;
    data.value = res.list;
    total.value = res.total;
  } finally {
    if (version === fetchVersion) {
      loading.value = false;
    }
  }
};

// ========== 模式选择 ==========
// 以下展示"事件驱动"模式
// 若要切换为"watch 自动请求"模式，注释掉事件驱动部分，取消注释 watch 部分

// --- 事件驱动模式 ---
const handleConditionUpdate = () => {
  if (currentPage.value !== 1) {
    // currentPage 变化会触发下方 watch，自动调用 fetchData
    currentPage.value = 1;
  } else {
    // currentPage 已经是 1，watch 不会触发，需要手动请求
    fetchData();
  }
};

watch([currentPage, pageSize], fetchData);

// --- watch 自动请求模式（取消注释以启用）---
// watch(conditions, () => {
//   currentPage.value = 1;
// }, { deep: true });
//
// watch([currentPage, pageSize, conditions], fetchData, { deep: true, immediate: true });

fetchData();
</script>

<template>
  <ODataTable
    :columns="columns"
    :data="data"
    v-model:conditions="conditions"
    :loading="loading"
    @condition-update="handleConditionUpdate"
  />
  <OPagination
    v-model:page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :layout="['total', 'pagesize', 'pager', 'jumper']"
    style="margin-top: 16px;"
  />
</template>
