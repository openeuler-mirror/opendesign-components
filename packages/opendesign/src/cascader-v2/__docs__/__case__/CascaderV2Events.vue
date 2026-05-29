<docs lang="md">
<!-- zh-CN -->

### 事件

`OCascaderV2` 支持以下事件:

- `update:modelValue(value)` — v-model 同步更新
- `change(value)` — 选中值变化
- `options-visible-change(visible)` — 选项浮层显示/隐藏切换
- `clear(evt)` — 点击清除按钮
- `lazyload-error(node)` — 懒加载失败(配合 `lazy` 使用)

所有事件均会在浏览器 console 中打印。

<!-- en-US -->

### Events

`OCascaderV2` supports the following events:

- `update:modelValue(value)` — v-model sync
- `change(value)` — selection changed
- `options-visible-change(visible)` — dropdown visibility changed
- `clear(evt)` — clear button clicked
- `lazyload-error(node)` — lazy load failed (used with `lazy`)

All events are logged to the browser console.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem, type CascaderV2ValueT } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val = ref<CascaderV2ValueT>();

const options = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      { label: 'Sub 1-1', value: '1-1' },
      { label: 'Sub 1-2', value: '1-2' },
    ],
  },
  { label: 'Option 2', value: '2' },
];

const onChange = (value: unknown) => {
  console.log('[cascader-v2] change', value);
};
const onVisibleChange = (visible: boolean) => {
  console.log('[cascader-v2] options-visible-change', visible);
};
const onClear = (evt: Event) => {
  console.log('[cascader-v2] clear', evt);
};
const onUpdate = (value: unknown) => {
  console.log('[cascader-v2] update:modelValue', value);
};
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="80px">
    <OFormItem label="级联选择">
      <OCascaderV2
        v-model="val"
        :options="options"
        clearable
        class="demo-cascader-v2"
        @update:model-value="onUpdate"
        @change="onChange"
        @options-visible-change="onVisibleChange"
        @clear="onClear"
      />
      <template #extra>modelValue: {{ val }}</template>
    </OFormItem>
  </OForm>
</template>

<style lang="scss">
.demo-cascader-v2 {
  width: 100%;
  max-width: 320px;
}
</style>
