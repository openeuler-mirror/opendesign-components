<docs lang="md">
<!-- zh-CN -->

### 主题规范

#### 运营标签

<!-- en-US -->

### Theme Specification

#### Operation Tags
</docs>
<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
</script>

<template>
  <div class="col">
    <OTag color="danger">NEW</OTag>
    <OTag color="danger">HOT</OTag>
    <OTag color="danger">推荐</OTag>
    <OTag color="main2">变量main2</OTag>
  </div>
</template>

<style lang="scss" scoped>
.col {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
</style>
