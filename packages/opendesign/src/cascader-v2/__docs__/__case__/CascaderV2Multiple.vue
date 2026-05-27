<docs lang="md">
<!-- zh-CN -->

### 多选

通过 `multiple` 开启多选。多选时可用 `maxTagCount` 限制可视标签数量,超出部分会折叠为 `+N`;通过 `foldLabel` 自定义折叠文案。`showFoldTags` 控制悬浮/点击展开收起项。

- `allowSelectAnyNode`: false (默认),仅叶子节点参与计数,父节点为半选/全选汇总
- `allowSelectAnyNode`: true,任意层级节点都可独立选中

<!-- en-US -->

### Multiple

Enable multiple selection with `multiple`. Use `maxTagCount` to limit visible tags; overflowed tags fold as `+N`, customizable via `foldLabel`. `showFoldTags` controls hover/click to expand folded tags.

- `allowSelectAnyNode`: false (default), only leaves count toward selection
- `allowSelectAnyNode`: true, any node can be selected independently
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem, type SelectOptionT } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      { label: 'Sub 1-1', value: '1-1' },
      { label: 'Sub 1-2', value: '1-2' },
      { label: 'Sub 1-3', value: '1-3' },
    ],
  },
  {
    label: 'Option 2',
    value: '2',
    children: [
      { label: 'Sub 2-1', value: '2-1' },
      { label: 'Sub 2-2', value: '2-2' },
    ],
  },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
];

const val1 = ref<Array<string | number>>([]);
const val2 = ref<Array<string | number>>([]);
const val3 = ref<Array<string | number>>([]);

const foldLabel = (tags: Array<SelectOptionT>) => `还有 ${tags.length} 项`;
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="基础多选">
      <OCascaderV2 v-model="val1" :options="options" multiple clearable placeholder="请选择多个" class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="maxTagCount=1 + 自定义折叠">
      <OCascaderV2
        v-model="val2"
        :options="options"
        multiple
        :max-tag-count="1"
        :fold-label="foldLabel"
        show-fold-tags="hover"
        clearable
        class="demo-cascader-v2"
      />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
    <OFormItem label="allowSelectAnyNode">
      <OCascaderV2 v-model="val3" :options="options" multiple allow-select-any-node clearable placeholder="任意节点都可选" class="demo-cascader-v2" />
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
