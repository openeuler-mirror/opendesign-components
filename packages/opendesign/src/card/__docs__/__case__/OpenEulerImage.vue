<docs lang="md">
<!-- zh-CN -->

#### 图文卡片

欧拉主题中图片与卡片之间没有间距，可以给 `OCard` 添加 `c-card-openeuler` 类名应用该样式。

<!-- en-US -->

#### Image-Text Card

In the Euler Theme, there is no spacing between the image and the card.
You can add the `c-card-openeuler` class name to the `OCard` component to apply this styling.
</docs>
<script setup lang="ts">
import { OCard } from '@opensig/opendesign';
</script>
<template>
  <div class="card-group">
    <OCard title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="c-card-openeuler" />
    <OCard layout="h" title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="c-card-openeuler" />
  </div>
</template>
<style lang="scss" scoped>
.card-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.c-card-openeuler {
  width: 50%;
}
@media (max-width: 840px) {
  .card-group {
    flex-direction: column;
  }
  .c-card-openeuler {
    width: auto;
  }
}
</style>
