<docs lang="md">
<!-- zh-CN -->

### 圆角

<!-- en-US -->

### Round
</docs>

<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
</script>

<template>
  <section>
    <OTag round="pill" color="primary">round="pill"</OTag>
    <OTag round="2px" color="primary">round="2px"</OTag>
    <OTag round="4px" color="primary">round="4px"</OTag>
  </section>
</template>

<style lang="scss" scoped>
section {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
</style>
