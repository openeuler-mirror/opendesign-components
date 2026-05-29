<docs lang="md">
<!-- zh-CN -->

### 展开方式

通过 `expandTrigger` 控制次级菜单的展开触发:

- `click` (默认) — 点击非叶子节点才展开下一列
- `hover` — 鼠标悬停即展开,适合层级深、节点密集的场景

触摸设备会被强制降级为 `click`,避免误触。

<!-- en-US -->

### Expand Trigger

`expandTrigger` controls how submenus expand:

- `click` (default) — click a non-leaf node to expand the next column
- `hover` — hover to expand, useful for dense, deeply nested trees

Touch devices fall back to `click`.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Zhejiang',
    value: 'zj',
    children: [
      {
        label: 'Hangzhou',
        value: 'hz',
        children: [
          { label: 'Xihu', value: 'xh' },
          { label: 'Yuhang', value: 'yh' },
        ],
      },
      { label: 'Ningbo', value: 'nb' },
    ],
  },
  {
    label: 'Jiangsu',
    value: 'js',
    children: [
      { label: 'Nanjing', value: 'nj' },
      { label: 'Suzhou', value: 'sz' },
    ],
  },
];

const val1 = ref();
const val2 = ref();
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="200px">
    <OFormItem label="expandTrigger='click'">
      <OCascaderV2 v-model="val1" :options="options" clearable class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="expandTrigger='hover'">
      <OCascaderV2 v-model="val2" :options="options" expand-trigger="hover" clearable class="demo-cascader-v2" />
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
