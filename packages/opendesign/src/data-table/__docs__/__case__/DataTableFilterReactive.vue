<docs lang="md">
<!--zh-CN-->

### 筛选选项联动更新

筛选某列后，其余列的可筛选项应基于剩余数据自动更新，但本列选项始终保持完整不受自身条件收窄。

<!--en-US-->

### Filter Options Reactive Update

After filtering one column, the filter options of other columns update based on the remaining data, while each column's own options stay unaffected by its own condition.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { DataTableColumnT, ODataTable } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

/** 全量原始数据（不变） */
const allData = getTableData(10);

/** 当前展示数据（受全部筛选条件影响） */
const data = ref<any[]>([...allData]);

const conditions = ref<{
  name: string[];
  gender: string[];
}>({
  name: [],
  gender: [],
});

/**
 * @description 按其他列的筛选条件过滤数据（排除指定列自身的条件），
 *              作为 optionsFn 的选项来源——避免列自身条件收窄自身可选范围。
 *              内部访问 conditions.value，依赖变更时由 TableColumnFilter 的
 *              watchEffect 自动重新调用 optionsFn。
 * @param excludeKey - 排除的列 key
 * @returns 过滤后的数据子集
 */
const dataExcludingCondition = (excludeKey: string) => {
  let res = [...allData];
  for (const [key, values] of Object.entries(conditions.value)) {
    if (key !== excludeKey && values?.length) {
      res = res.filter((v) => values.includes(v[key]));
    }
  }
  return res;
};

/** 列配置：optionsFn 从排除自身条件的数据中提取去重选项 */
const columns: DataTableColumnT[] = [
  {
    label: 'Name',
    key: 'name',
    filter: {
      showInput: true,
      multiple: true,
      optionTitle: 'Select Name',
      optionsFn({ emptyOption }) {
        const names = [...new Set(dataExcludingCondition('name').map((v) => v.name))];
        return [...names.map((name) => ({ label: name, value: name })), emptyOption];
      },
    },
  },
  {
    label: 'Gender',
    key: 'gender',
    filter: {
      showInput: false,
      multiple: true,
      optionTitle: 'Select Gender',
      optionsFn({ emptyOption }) {
        const genders = [...new Set(dataExcludingCondition('gender').map((v) => v.gender))];
        return [...genders.map((g) => ({ label: g, value: g })), emptyOption];
      },
    },
  },
  { label: 'Age', key: 'age' },
  { label: 'Salary', key: 'salary' },
];

const loading = ref(false);

/** 筛选条件变化时按全部条件重新过滤数据 */
const filterData = () => {
  loading.value = true;
  setTimeout(() => {
    let res = [...allData];
    if (conditions.value.name?.length) {
      res = res.filter((v) => conditions.value.name.includes(v.name));
    }
    if (conditions.value.gender?.length) {
      res = res.filter((v) => conditions.value.gender.includes(v.gender));
    }
    data.value = res;
    loading.value = false;
  }, 500);
};
</script>

<template>
  <ODataTable :columns="columns" :data="data" :conditions="conditions" :loading="loading" @condition-update="filterData" />
</template>
