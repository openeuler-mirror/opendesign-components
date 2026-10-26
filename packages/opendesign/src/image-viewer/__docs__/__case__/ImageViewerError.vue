<docs lang="md">
<!-- zh-CN -->

### 错误状态

当图片地址无效或加载失败时，组件自动展示错误占位——显示错误图标与提示文案，点击可重新加载。通过 `error` 事件可监听加载失败并执行自定义逻辑（如上报埋点、降级处理）。下方示例使用不存在的图片地址触发错误状态，点击错误占位可重试。

自定义错误占位内容请参考「自定义插槽」示例。

<!-- en-US -->

### Error State

When an image URL is invalid or fails to load, the component automatically displays an error placeholder — showing an error icon and hint text, clickable to retry. Listen to the `error` event to execute custom logic on load failure (e.g., analytics reporting, fallback handling). The example below uses a non-existent image URL to trigger the error state — click the placeholder to retry.

For customizing the error placeholder content, see the "Custom Slots" example.
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
