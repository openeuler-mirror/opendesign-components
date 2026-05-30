<docs lang="md">
<!-- zh-CN -->

### 可搜索

通过 `filterable` 开启输入框搜索:

- 默认情况下,搜索结果只展示叶子节点的完整路径
- 配合 `allowSelectAnyNode` 时,搜索会覆盖所有层级的节点

搜索关键字会在选项中高亮显示。

<!-- en-US -->

### Filterable

Enable in-place searching with `filterable`:

- By default, only leaf paths appear in search results
- With `allowSelectAnyNode`, all levels are included

The keyword is highlighted within matched options.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Frontend',
    value: 'fe',
    children: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Svelte', value: 'svelte' },
    ],
  },
  {
    label: 'Backend',
    value: 'be',
    children: [
      { label: 'Node.js', value: 'node' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
  },
  {
    label: 'Mobile',
    value: 'mobile',
    children: [
      { label: 'iOS', value: 'ios' },
      { label: 'Android', value: 'android' },
    ],
  },
];

const val1 = ref();
const val2 = ref();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="260px">
    <OFormItem label="filterable (仅叶子)">
      <OCascaderV2 v-model="val1" :options="options" filterable clearable placeholder="尝试输入 vue" class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="filterable + allowSelectAnyNode">
      <OCascaderV2 v-model="val2" :options="options" filterable allow-select-any-node clearable placeholder="尝试输入 fe" class="demo-cascader-v2" />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
  </OForm>
</template>

<style lang="scss">
.demo-cascader-v2 {
  width: 100%;
  max-width: 320px;
}
</style>
