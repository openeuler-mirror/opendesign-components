<docs lang="md">
<!-- zh-CN -->

### 绑定值形态

通过 `emitPath` 切换绑定值形态:

- `emitPath`: false (默认) — 返回叶子节点的 `value`,多选时为 `value[]`
- `emitPath`: true — 返回从根到叶子的路径数组,多选时为 `value[][]`

`pathMode` 控制 `OCascaderV2Panel` 在内部派发事件时是否使用路径模式,等同于面板内的 emitPath。

<!-- en-US -->

### Bound Value Shape

`emitPath` toggles the value shape:

- `emitPath`: false (default) — returns the leaf `value`; multi-select returns `value[]`
- `emitPath`: true — returns the full path from root to leaf; multi-select returns `value[][]`

`pathMode` is the panel-level counterpart for `OCascaderV2Panel`.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Hua Dong',
    value: 'east',
    children: [
      { label: 'Shanghai', value: 'sh' },
      { label: 'Hangzhou', value: 'hz' },
    ],
  },
  {
    label: 'Hua Bei',
    value: 'north',
    children: [
      { label: 'Beijing', value: 'bj' },
      { label: 'Tianjin', value: 'tj' },
    ],
  },
];

const val1 = ref<string | number>();
const val2 = ref<Array<string | number>>();
const val3 = ref<Array<string | number>>([]);
// 多选 + emitPath 时为 Array<Array>,超出当前 modelValue prop 的联合类型,使用 any 兜底
const val4 = ref<any>([]);
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="260px">
    <OFormItem label="单选 + emitPath=false (默认)">
      <OCascaderV2 v-model="val1" :options="options" clearable class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="单选 + emitPath=true">
      <OCascaderV2 v-model="val2" :options="options" emit-path clearable class="demo-cascader-v2" />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
    <OFormItem label="多选 + emitPath=false">
      <OCascaderV2 v-model="val3" :options="options" multiple clearable class="demo-cascader-v2" />
      <template #extra>{{ val3 }}</template>
    </OFormItem>
    <OFormItem label="多选 + emitPath=true">
      <OCascaderV2 v-model="val4" :options="options" multiple emit-path clearable class="demo-cascader-v2" />
      <template #extra>{{ val4 }}</template>
    </OFormItem>
  </OForm>
</template>

<style lang="scss">
.demo-cascader-v2 {
  width: 100%;
  max-width: 320px;
}
</style>
