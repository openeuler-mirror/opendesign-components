<docs lang="md">
<!-- zh-CN -->

### 加载失败

- 可通过 `error` 事件监听加载失败事件，`load` 事件监听加载成功事件
- 可通过 `error` 插槽自定义失败内容

注意：图片加载失败时，可能导致元素宽度及高度坍塌，可显示设置宽高或 `ratio`。

<!-- en-US -->

### Loading Failure

- The `error` event can be used to listen for loading failure events, and the `load` event can be used to listen for successful loading events
- Custom failure content can be defined through the `error` slot

Note: When image loading fails, it may cause the element's width and height to collapse.
Explicitly set the width and height or use the `ratio` attribute to prevent this.
</docs>
<script setup lang="ts">
import { OFigure } from '@opensig/opendesign';
</script>
<template>
  <OFigure src="/this-picture-does-not-exist.jpg" :ratio="16 / 9" class="figure-item" />

  <OFigure src="/this-picture-does-not-exist.jpg" :ratio="16 / 9" class="figure-item">
    <template #error>FAILED</template>
  </OFigure>
</template>
<style scoped lang="scss">
.figure-item {
  display: block;
  max-width: 500px;
  & + .figure-item {
    margin-top: 16px;
  }
}
</style>
