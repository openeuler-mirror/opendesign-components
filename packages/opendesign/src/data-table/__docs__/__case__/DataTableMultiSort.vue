<docs lang="md">
<!--zh-CN-->

### 多条件排序 ^[NEXT](primary)

设置 `sortMode` 为 `multiple` 开启多条件排序模式，多列可同时排序。通过 `sortSequence` 维护排序条件的操作序列，数组顺序即用户点击的先后顺序：

- **新增排序条件**：追加到序列末尾
- **取消排序**：从序列中移除
- **仅切换排序方向**（升序↔降序）：在序列中的位置不变
- **取消后再次赋予排序**：追加到序列末尾（视为新的操作）

`sortSequence` 仅记录操作先后，排序优先级的解读由调用者自行决定。业界常见做法是将先赋予的条件视为最高优先级，后续条件在前序同序分组内再细分排序。

`@sort-update` 事件的 payload 中包含 `sortSequence` 字段，可用于服务端排序时传递操作序列参数。

<!--en-US-->

### Multi-Column Sort ^[NEXT](primary)

Set `sortMode` to `multiple` to enable multi-column sorting, where multiple columns can be sorted simultaneously. The `sortSequence` prop maintains the operation sequence of sort conditions, where array order reflects the order of user clicks:

- **New sort condition**: appended to the end of the sequence
- **Cancelled sort**: removed from the sequence
- **Direction toggle only** (ascending ↔ descending): position in the sequence remains unchanged
- **Re-activated after cancellation**: appended to the end (treated as a new operation)

`sortSequence` records only the order of activation; interpretation of sort priority is up to the caller. A common industry practice is to treat earlier-activated conditions as highest priority, with later conditions providing sub-sorting within ties of earlier conditions.

The `@sort-update` event payload includes a `sortSequence` field, which can be used to pass the operation sequence parameters for server-side sorting.
</docs>

<script setup lang="ts">
/**
 * @description 多条件排序示例，展示 sortMode="multiple" 下的多列同时排序用法
 * 包含：sortSequence 双向绑定、@sort-update 事件处理、多列排序数据请求
 */
import { computed, ref, watch } from 'vue';
import { DataTableSortMethod, ODataTable } from '@opensig/opendesign';
import type { DataTableColumnT, DataTableSortMethodT, DataTableSortUpdatePayload } from '@opensig/opendesign';
import '../../style';

/** 多条件排序演示数据的行结构 */
interface MultiSortRow {
  name: string;
  gender: string;
  age: number;
  salary: number;
  address: string;
}

/** MultiSortRow 中可参与数值比较的字段（age、salary 为 number 类型） */
type NumericField = 'age' | 'salary';

/** 比较器函数：接收两行数据，返回排序比较结果 */
type ComparatorFn = (a: MultiSortRow, b: MultiSortRow) => number;

const data = ref<MultiSortRow[]>([]);
const loading = ref(false);

/**
 * @description 多条件排序专用的演示数据
 * 关键设计：同年龄段内薪资差异明显，使多列排序效果可直观区分
 * - 每组 age 相同的行，salary 一高一低，次排序方向变化时组内顺序翻转
 */
const multiSortRawData: MultiSortRow[] = [
  { name: 'Alice Johnson', gender: 'Female', age: 25, salary: 85000, address: '12 Park Road, London' },
  { name: 'Bob Williams', gender: 'Male', age: 25, salary: 32000, address: '45 King Street, London' },
  { name: 'Carol Brown', gender: 'Female', age: 30, salary: 65000, address: '78 Queen Ave, London' },
  { name: 'David Lee', gender: 'Male', age: 30, salary: 28000, address: '91 Elm Lane, London' },
  { name: 'Eve Chen', gender: 'Female', age: 35, salary: 72000, address: '33 Oak Road, London' },
  { name: 'Frank Zhang', gender: 'Male', age: 35, salary: 40000, address: '56 Pine Street, London' },
  { name: 'Grace Wang', gender: 'Female', age: 40, salary: 55000, address: '19 Maple Ave, London' },
  { name: 'Henry Liu', gender: 'Male', age: 40, salary: 35000, address: '64 Cedar Lane, London' },
];

/** 列配置：Age 和 Salary 均可排序 */
const columns = computed<DataTableColumnT[]>(() => [
  { label: 'Name', key: 'name' },
  { label: 'Gender', key: 'gender' },
  { label: 'Age', key: 'age', sortKey: 'ageSort' },
  { label: 'Salary', key: 'salary', sortKey: 'salarySort' },
  { label: 'Address', key: 'address' },
]);

/** 筛选与排序条件对象，排序列初始值用 DataTableSortMethod.NA */
const conditions = ref<{
  ageSort?: DataTableSortMethodT;
  salarySort?: DataTableSortMethodT;
}>({
  ageSort: DataTableSortMethod.NA,
  salarySort: DataTableSortMethod.NA,
});

/** 排序条件的操作序列，数组顺序即用户点击的先后顺序，优先级由调用者自行解读 */
const sortSequence = ref<string[]>([]);

/**
 * @description 根据 conditions 和 sortSequence 对数据进行多条件排序
 * sortSequence 仅记录操作先后，优先级由调用者自行解读
 * 本示例采用业界常见做法：先赋予的条件优先级最高（数组头部），后续条件在前序同序分组内细分排序
 * 算法：单次 .sort() 调用中组合所有排序条件，从头部（最早操作）到尾部（最近操作）依次比较，
 *       优先级高的条件能区分时直接返回结果，无法区分时降级到优先级较低的条件
 * @returns 排序后的数据数组
 */
const sortDataBySequence = (rawData: MultiSortRow[]): MultiSortRow[] => {
  /** 从 sortSequence 头部到尾部构建比较器链（头部为最早操作，优先级最高，最先比较） */
  const comparators: ComparatorFn[] = sortSequence.value
    .map((key) => {
      const sortVal = conditions.value[key as keyof typeof conditions.value];
      /** sortKey → 实际数据字段的映射 */
      const fieldMap: Record<string, NumericField> = { ageSort: 'age', salarySort: 'salary' };
      const field = fieldMap[key];
      if (!field) return null;
      if (sortVal === DataTableSortMethod.ASC) return (a: MultiSortRow, b: MultiSortRow) => a[field] - b[field];
      if (sortVal === DataTableSortMethod.DESC) return (a: MultiSortRow, b: MultiSortRow) => b[field] - a[field];
      return null;
    })
    .filter((cmp): cmp is ComparatorFn => cmp !== null);

  return [...rawData].sort((a, b) => {
    for (const cmp of comparators) {
      const result = cmp(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
};

/**
 * @description 请求数据，模拟服务端排序场景
 * 实际项目中可将 conditions 和 sortSequence 传给服务端
 */
const getData = async () => {
  loading.value = true;
  data.value = [];
  try {
    data.value = await new Promise((resolve) => {
      setTimeout(() => {
        const res = sortDataBySequence(multiSortRawData);
        resolve(res);
      }, 800);
    });
  } finally {
    loading.value = false;
  }
};

/** 监听 conditions 变化自动重新请求数据 */
watch(conditions, getData, { deep: true });

/**
 * @description 排序更新事件处理，打印 payload 中的 sortSequence 信息
 * @param {DataTableSortUpdatePayload} payload - 排序更新事件传参
 */
const handleSortUpdate = (payload: DataTableSortUpdatePayload) => {
  console.log('sort-update payload:', payload);
  /** payload.sortSequence 可用于传递给服务端排序接口 */
};

getData();
</script>

<template>
  <ODataTable
    :columns="columns"
    :data="data"
    :conditions="conditions"
    sort-mode="multiple"
    v-model:sort-sequence="sortSequence"
    :loading="loading"
    @sort-update="handleSortUpdate"
  />
</template>
