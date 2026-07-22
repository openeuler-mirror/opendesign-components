<docs lang="md">
<!-- zh-CN -->

### 尺寸

<!-- en-US -->

### Size
</docs>

<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
</script>

<template>
  <div class="col">
    <OTag size="large">Large Tag</OTag>
    <OTag size="medium">Medium Tag</OTag>
    <OTag size="small">Small Tag</OTag>
  </div>
</template>

<style lang="scss" scoped>
.col {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
</style>
