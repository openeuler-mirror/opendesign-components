<docs lang="md">
<!-- zh-CN -->

### 禁用 / 加载

- `disabled` — 整体禁用选择器,不可交互
- 选项数据中的 `disabled` 字段 — 单个节点禁用,无法被选中也无法触发展开
- `loading` — 选择器进入加载态,展示 loading 图标且不可交互

<!-- en-US -->

### Disabled / Loading

- `disabled` — disables the whole cascader
- The `disabled` field on an option — disables that specific node
- `loading` — shows a loading icon and blocks interaction
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Available',
    value: 'avail',
    children: [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2 (disabled)', value: '2', disabled: true },
      { label: 'Item 3', value: '3' },
    ],
  },
  {
    label: 'Locked',
    value: 'locked',
    disabled: true,
    children: [{ label: 'Item 4', value: '4' }],
  },
  { label: 'Other', value: 'other' },
];

const val1 = ref('1');
const val2 = ref();
const val3 = ref();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="200px">
    <OFormItem label="disabled (整体)">
      <OCascaderV2 v-model="val1" :options="options" disabled clearable class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="节点 disabled">
      <OCascaderV2 v-model="val2" :options="options" clearable placeholder="父/子节点都可设禁用" class="demo-cascader-v2" />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
    <OFormItem label="loading">
      <OCascaderV2 v-model="val3" :options="options" loading clearable class="demo-cascader-v2" />
      <template #extra>{{ val3 }}</template>
    </OFormItem>
  </OForm>
</template>

<style lang="scss">
.demo-cascader-v2 {
  width: 100%;
  max-width: 320px;
}
</style>
