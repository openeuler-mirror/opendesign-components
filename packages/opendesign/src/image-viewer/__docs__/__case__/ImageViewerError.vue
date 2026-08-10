<docs lang="md">
<!-- zh-CN -->

### 错误状态

当图片地址无效或加载失败时，组件自动展示错误占位——显示错误图标与提示文案，点击可重新加载。通过 `error` 事件可监听加载失败并执行自定义逻辑（如上报埋点、降级处理）。下方示例使用不存在的图片地址触发错误状态，点击错误占位可重试。

`error` 插槽可自定义错误占位内容，作用域参数包含 `activeIndex`（当前索引）与 `src`（图片地址），便于根据上下文渲染差异化提示。

<!-- en-US -->

### Error State

When an image URL is invalid or fails to load, the component automatically displays an error placeholder — showing an error icon and hint text, clickable to retry. Listen to the `error` event to execute custom logic on load failure (e.g., analytics reporting, fallback handling). The example below uses a non-existent image URL to trigger the error state — click the placeholder to retry.

The `error` slot allows customizing the error placeholder content. Scope props include `activeIndex` (current index) and `src` (image URL) for context-aware rendering.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

/** 无效图片地址，用于触发错误状态 */
const brokenList = ['https://www.openeuler.org/img/nonexistent-broken-image.png'];
const visible = ref(false);
const errorCount = ref(0);

const onShow = () => {
  visible.value = true;
};
const onClose = () => {
  visible.value = false;
};
const onError = () => {
  errorCount.value++;
};
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" @click="onShow">显示预览（错误图片）</OButton>
    <OImageViewer v-model:visible="visible" :preview-list="brokenList" @close="onClose" @error="onError" />
    <span v-if="errorCount" class="demo-hint">已触发 {{ errorCount }} 次错误事件</span>
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.demo-hint {
  font-size: var(--o-font_size-text2);
  color: var(--o-color-info3);
}
</style>
