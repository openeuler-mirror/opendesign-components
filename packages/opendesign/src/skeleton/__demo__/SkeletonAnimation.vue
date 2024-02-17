<script setup lang="ts">
import { OSkeleton } from '../index';
</script>

<template>
  <h4>动画效果</h4>
  <section>
    <OSkeleton animation />
  </section>
</template>

<style lang="scss" scoped>
section {
  display: block;
  background-color: var(--o-color-fill2);
}
</style>
