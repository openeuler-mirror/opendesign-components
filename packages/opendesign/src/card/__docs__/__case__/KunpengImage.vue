<docs lang="md">
<!-- zh-CN -->

#### 图文卡片

鲲鹏主题中封面图片与卡片边缘之间没有间距，可以给 `OCard` 添加 `c-card-kunpeng` 类名应用该样式。

<!-- en-US -->

#### Image-Text Card

In the Kunpeng Theme, there is no spacing between the cover image and the card edge.
You can add the `c-card-kunpeng` class name to the `OCard` component to apply this styling.
</docs>
<script setup lang="ts">
import { OCard } from '@opensig/opendesign';
</script>
<template>
  <div class="card-group">
    <OCard title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="c-card-kunpeng" />
    <OCard layout="h" title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="c-card-kunpeng" />
  </div>
</template>
<style lang="scss" scoped>
.card-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.c-card-kunpeng {
  width: 50%;
}
@media (max-width: 840px) {
  .card-group {
    flex-direction: column;
  }
  .c-card-kunpeng {
    width: auto;
  }
}
</style>
