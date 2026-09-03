<docs lang="md">
  <!-- zh-CN -->

### 数据驱动选项 ^[1.2.7](primary)

通过 `options` prop 传入选项数据，无需使用 `OOption` 插槽。支持扁平选项与 `{ type: 'group', children }` 分组结构。

配合 `fieldNames` 可自定义选项数据的字段名，适配后端数据结构，无需手动转换。

  <!-- en-US -->

### Data-driven Options ^[1.2.7](primary)

Pass option data via the `options` prop without using `OOption` slots. Supports flat options and `{ type: 'group', children }` group structure.

Use `fieldNames` to customize option data field names to adapt to backend data structures without manual conversion.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OButton, OForm, OFormItem, OSelect } from '@opensig/opendesign';

/** 扁平选项数据 */
const flatOptions = [
  { label: '选项 1', value: 'opt1' },
  { label: '选项 2', value: 'opt2' },
  { label: '选项 3', value: 'opt3' },
  { label: '选项 4', value: 'opt4', disabled: true },
  { label: '选项 5', value: 'opt5' },
];

/** 分组选项数据 */
const groupOptions = [
  {
    type: 'group',
    key: 'group1',
    label: '一线城市',
    children: [
      { label: '北京', value: 'bj' },
      { label: '上海', value: 'sh' },
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
    ],
  },
  {
    type: 'group',
    key: 'group2',
    label: '新一线城市',
    children: [
      { label: '成都', value: 'cd' },
      { label: '杭州', value: 'hz' },
      { label: '武汉', value: 'wh' },
    ],
  },
];

/** 自定义字段名的选项数据（模拟后端返回） */
const customFieldOptions = [
  { name: '咖啡', code: 1, isDisabled: false },
  { name: '红茶', code: 2, isDisabled: false },
  { name: '绿茶', code: 3, isDisabled: true },
  { name: '果汁', code: 4, isDisabled: false },
];

/** 自定义字段名映射 */
const customFieldNames = {
  value: 'code',
  label: 'name',
  disabled: 'isDisabled',
};

/** 动态更新选项数据 */
const dynamicOptions = ref<{ label: string; value: string }[]>([
  { label: '加载项 A', value: 'a' },
  { label: '加载项 B', value: 'b' },
]);

const selectVal1 = ref();
const selectVal2 = ref();
const selectVal3 = ref();
const selectVal4 = ref('a');

/** 模拟异步加载更多选项 */
const loadMore = () => {
  const next = String.fromCharCode(97 + dynamicOptions.value.length);
  dynamicOptions.value.push({ label: `加载项 ${next.toUpperCase()}`, value: next });
};
</script>
<template>
  <OForm layout="v" class="demo-select-options-wrap">
    <OFormItem label="扁平选项">
      <OSelect v-model="selectVal1" :options="flatOptions" placeholder="请选择" clearable class="demo-select" />
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="分组选项">
      <OSelect v-model="selectVal2" :options="groupOptions" placeholder="请选择城市" clearable class="demo-select" />
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义字段">
      <OSelect v-model="selectVal3" :options="customFieldOptions" :field-names="customFieldNames" placeholder="请选择饮品" clearable class="demo-select" />
      <template #extra
        ><u>selectVal3: {{ JSON.stringify(selectVal3) }}</u></template
      >
    </OFormItem>
    <OFormItem label="动态更新">
      <div class="demo-row-inline">
        <OSelect v-model="selectVal4" :options="dynamicOptions" placeholder="请选择" clearable class="demo-select" />
        <OButton size="small" variant="outline" @click="loadMore">添加选项</OButton>
      </div>
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-options-wrap {
  .demo-select {
    max-width: 320px;
  }
  .demo-row-inline {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
</style>
