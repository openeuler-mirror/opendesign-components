<docs lang="md">
<!--zh-CN-->

### 过滤与排序

<!--en-US-->

### Filter & Sort
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DataTableColumnT, DataTableColumnFilterOption, DataTableSortMethod, DataTableSortMethodT } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const data = ref<any[]>([]);

const salaryFilterOptions: (DataTableColumnFilterOption<string, string> & {
  filter: (data: any) => boolean | void;
})[] = [
  { label: '< 27004', value: '<27004', filter: (_data) => _data.salary < 27004 },
  { label: '27004-27006', value: '27004-27006', filter: (_data) => _data.salary >= 27004 && _data.salary <= 27006 },
  { label: '> 27006', value: '>27006', filter: (_data) => _data.salary > 27006 },
] as const;

const columns = computed<DataTableColumnT[]>(() => {
  return [
    {
      label: 'Name',
      key: 'name',
      filter: {
        showInput: true,
        multiple: true,
        optionTitle: 'Select Name',
        // optionsFn 接收 { column, emptyOption } 参数；emptyOption 为内置的"空值"筛选项
        optionsFn({ emptyOption }) {
          return [
            ...getTableData(8).map((v) => {
              return { label: v.name, value: v.name };
            }),
            emptyOption, // 将内置空值选项加入列表，用户可筛选出该列为空的数据
          ];
        },
      },
    },
    {
      label: 'Gender',
      key: 'gender',
      filter: {
        showInput: false,
        multiple: false,
        optionTitle: 'Select Gender',
        optionsFn() {
          return [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ];
        },
      },
    },
    {
      label: 'Age',
      key: 'age',
      sortKey: 'ageSort',
    },
    {
      label: 'Salary',
      key: 'salary',
      filter: {
        optionTitle: 'Select Salary',
        optionsFn: () => Promise.resolve(salaryFilterOptions),
      },
    },
  ];
});

// conditions 对象的 key 需对应列的 key（筛选列）或 sortKey（排序列）
// 筛选列初始值为空数组 []，排序列初始值用 DataTableSortMethod.NA
const conditions = ref<{
  name: string[];
  gender: string[];
  salary: string[];
  ageSort?: DataTableSortMethodT;
}>({
  name: [],
  gender: [],
  salary: [],
  ageSort: DataTableSortMethod.NA,
});

const loading = ref(false);
// 监听 @condition-update 事件，在筛选/排序条件变更时重新请求数据
const getData = async () => {
  loading.value = true;
  data.value = [];
  try {
    data.value = await new Promise((resolve) => {
      setTimeout(() => {
        let res = getTableData(8);
        if (conditions.value.name?.length) {
          res = res.filter((v) => conditions.value.name.includes(v.name));
        }
        if (conditions.value.gender?.length) {
          res = res.filter((v) => conditions.value.gender.includes(v.gender));
        }
        if (conditions.value.salary?.length) {
          res = res.filter((v) => conditions.value.salary.map((condition) => salaryFilterOptions.find((x) => x.value === condition)).some((x) => x?.filter(v)));
        }
        if (conditions.value.ageSort === DataTableSortMethod.ASC) {
          res.sort((a, b) => a.age - b.age);
        }
        if (conditions.value.ageSort === DataTableSortMethod.DESC) {
          res.sort((a, b) => b.age - a.age);
        }
        resolve(res);
      }, 1500);
    });
  } finally {
    loading.value = false;
  }
};

getData();
</script>

<template>
  <ODataTable :columns="columns" :data="data" :conditions="conditions" :loading="loading" @condition-update="getData" />
</template>
