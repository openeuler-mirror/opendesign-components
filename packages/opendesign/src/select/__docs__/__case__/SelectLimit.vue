<docs lang="md">
  <!-- zh-CN -->

### 多选上限与事件 ^[NEXT](primary)

通过 `limit` 限制多选数量，达到上限后未选项自动 disabled。触发 `exceed-limit` 事件提示用户。

多选删除 tag 时触发 `remove-tag` 事件，input 聚焦/失焦时触发 `focus` / `blur` 事件。

  <!-- en-US -->

### Multiple Limit & Events ^[NEXT](primary)

Use `limit` to restrict multiple selection count. Unselected options become disabled when the limit is reached, and `exceed-limit` event is emitted.

The `remove-tag` event fires when removing a tag, `focus` / `blur` events fire when input gains/loses focus.
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const limitVal = ref<string[]>([]);
const log = ref<string>('');

/** 选项数据 */
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
];
</script>
<template>
  <OForm layout="v" class="demo-select-limit">
    <OFormItem>
      <OSelect
        v-model="limitVal"
        multiple
        :limit="3"
        :options="options"
        placeholder="最多选 3 项"
        clearable
        class="demo-select"
        @exceed-limit="(v) => (log = `已达上限，无法选择 ${v}`)"
        @remove-tag="(v) => (log = `已移除 ${v}`)"
        @focus="log = 'input 聚焦'"
        @blur="log = 'input 失焦'"
      />
      <template #extra
        ><u>limitVal: {{ JSON.stringify(limitVal) }}{{ log ? ` | ${log}` : '' }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-limit {
  .demo-select {
    max-width: 320px;
  }
}
</style>
