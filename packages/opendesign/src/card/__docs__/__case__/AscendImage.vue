<docs lang="md">
<!-- zh-CN -->

#### 图文卡片

<!-- en-US -->

#### Image-Text card
</docs>
<script setup lang="ts">
import { OCard } from '@opensig/opendesign';
</script>
<template>
  <div class="card-group">
    <OCard title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="card-item" />
    <OCard layout="h" title="Image card title" detail="Image card detail" cover="/card-cover.jpg" hoverable cursor="pointer" class="card-item" />
  </div>
</template>
<style lang="scss" scoped>
.card-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.card-item {
  width: 50%;
}
@media (max-width: 840px) {
  .card-group {
    flex-direction: column;
  }
  .card-item {
    width: auto;
  }
}
</style>
