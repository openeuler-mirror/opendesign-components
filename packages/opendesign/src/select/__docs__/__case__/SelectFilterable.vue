<docs lang="md">
  <!-- zh-CN -->

### 可搜索选择器 ^[NEXT](primary)

通过 `filterable` 开启搜索过滤能力，input 变为可编辑状态。

- `filterOption`：`true`（默认）使用内置包含匹配，也可传入自定义过滤函数；`false` 关闭本地过滤（用于远程搜索）
- `filterMethod`：完全自定义过滤逻辑，优先级高于 `filterOption`
- `filterSort`：对搜索过滤后的结果排序，如按字母顺序排列
- `retainInputValue`：关闭下拉时是否保留搜索词，默认 `false` 清空
- `inputValue`：受控搜索词，配合 `v-model:inputValue` 使用
- `@search`：搜索词变化时触发，调用者可自行通过 `useDebounceFn` 等方式实现防抖

> ⚠️ **DOM 结构提示**：多选有 tag 时，主输入框（`.o-select-input`）不渲染，改为在 tag 区域内联渲染搜索 input（`.o-select-input--tag`），两者互斥。请勿通过 `querySelector` 等方式依赖固定的 input DOM 位置。

  <!-- en-US -->

### Filterable Selector ^[NEXT](primary)

Enable search/filter capability via `filterable`, the input becomes editable.

- `filterOption`: `true` (default) uses built-in contains matching, or pass a custom filter function; `false` disables local filtering (for remote search)
- `filterMethod`: fully custom filter logic, takes precedence over `filterOption`
- `filterSort`: sort the filtered results, e.g. alphabetically
- `retainInputValue`: whether to retain search query when closing dropdown, default `false` to clear
- `inputValue`: controlled search query, used with `v-model:inputValue`
- `@search`: triggered when search query changes, callers can debounce via `useDebounceFn` or similar

> ⚠️ **DOM Structure Note**: In multiple mode with tags, the main input (`.o-select-input`) is not rendered; instead an inline search input (`.o-select-input--tag`) is rendered inside the tag area — the two are mutually exclusive. Do not rely on a fixed input DOM position via `querySelector` or similar.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OSelect } from '@opensig/opendesign';
import { useDebounceFn } from '@vueuse/core';

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
  { label: '芒果', value: 'mango' },
  { label: '草莓', value: 'strawberry' },
  { label: '蓝莓', value: 'blueberry' },
];

/** 远程搜索模拟数据 */
const remoteOptions = ref<{ label: string; value: string }[]>([]);
const remoteLoading = ref(false);

/** 模拟远程搜索 */
const onRemoteSearch = useDebounceFn((query: string) => {
  if (!query) {
    remoteOptions.value = [];
    return;
  }
  remoteLoading.value = true;
  setTimeout(() => {
    remoteOptions.value = [
      { label: `${query} 结果 1`, value: `${query}_1` },
      { label: `${query} 结果 2`, value: `${query}_2` },
      { label: `${query} 结果 3`, value: `${query}_3` },
    ];
    remoteLoading.value = false;
  }, 500);
});

/** 自定义过滤函数：按首字母匹配 */
const customFilter = (input: string, option: { label: string; value: string }) => {
  return option.label.startsWith(input);
};

const selectVal1 = ref();
const selectVal2 = ref();
const sortVal = ref();
const selectVal4 = ref();
const searchValue = ref('');

/** filterSort 排序：搜索结果按字母顺序排列 */
const sortOptions = [
  { label: 'Banana', value: 'banana' },
  { label: 'Apple', value: 'apple' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];
</script>
<template>
  <OForm layout="v" class="demo-select-filterable-wrap">
    <OFormItem label="内置过滤">
      <OSelect v-model="selectVal1" :options="options" filterable placeholder="搜索水果名称" clearable class="demo-select" />
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="排序过滤">
      <OSelect
        v-model="sortVal"
        :options="sortOptions"
        filterable
        :filter-sort="(a: any, b: any) => a.label.localeCompare(b.label)"
        placeholder="搜索后结果按字母排序"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>sortVal: {{ JSON.stringify(sortVal) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义过滤">
      <OSelect v-model="selectVal2" :options="options" filterable :filter-option="customFilter" placeholder="按首字母匹配" clearable class="demo-select" />
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="远程搜索">
      <OSelect
        v-model="selectVal4"
        v-model:input-value="searchValue"
        :options="remoteOptions"
        filterable
        :filter-option="false"
        :loading="remoteLoading"
        placeholder="输入关键词搜索"
        clearable
        class="demo-select"
        @search="onRemoteSearch"
      />
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
    <OFormItem label="保留搜索词">
      <OSelect :options="options" filterable retain-input-value placeholder="关闭后不清空" clearable class="demo-select" />
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-filterable-wrap {
  .demo-select {
    max-width: 320px;
  }
}
</style>
