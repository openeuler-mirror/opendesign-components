<docs lang="md">
<!-- zh-CN -->

#### 状态标签

<!-- en-US -->

#### State Tags
</docs>
<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
</script>

<template>
  <div class="col">
    <OTag color="success">已完成</OTag>
    <OTag color="pending">进行中</OTag>
    <OTag color="danger">未通过</OTag>
    <OTag color="disabled">已结束</OTag>
  </div>
</template>

<style lang="scss" scoped>
.col {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
</style>
