<docs lang="md">
<!-- zh-CN -->

### 标签宽度随内容自适应

`labelWidth="auto"` 时标签列宽度随内容自适应：在下方输入框编辑标签文案，标签列宽度实时变化（MutationObserver 监听文本变更触发重测）；超出 `--form-label-max-width` 截断换行，低于 `--form-label-min-width` 撑到下限。多个标签会自动对齐到最宽值。

<!-- en-US -->

### Label Width Adapts to Content

With `labelWidth="auto"`, the label column adapts to content. Edit the label text in the input below to see the column resize live (re-measured by MutationObserver on text changes); it is clamped by `--form-label-max-width` (wraps) and floored by `--form-label-min-width`. Multiple labels auto-align to the widest one.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { OForm, OFormItem, OInput } from '@opensig/opendesign';

const state = reactive({ label: '用户名', value: '', email: '' });
</script>
<template>
  <div class="label-width-demo">
    <OInput v-model="state.label" placeholder="编辑标签文案，观察下方标签列宽度变化" style="width: 320px" />
    <OForm :model="state" label-width="auto">
      <OFormItem :label="state.label" field="value">
        <OInput v-model="state.value" />
      </OFormItem>
      <OFormItem label="邮箱" field="email">
        <OInput v-model="state.email" />
      </OFormItem>
    </OForm>
  </div>
</template>
<style scoped lang="scss">
.label-width-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
