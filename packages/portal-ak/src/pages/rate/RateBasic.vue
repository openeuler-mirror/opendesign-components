<script setup lang="ts">
import { ORate, OIconStar, OFlex } from '@opendesign-src/index';
</script>

<template>
  <h3>基础用法</h3>
  <section class="block">
    <div class="flex-box">
      <OIconStar class="c-star-full" />
      <span class="c-star-label">4.0</span>
    </div>

    <div class="flex-box">
      <OIconStar class="c-star-empty" />
      <span class="c-star-label">暂无评分</span>
    </div>

    <ORate :default-value="3" color="primary" size="large" />
  </section>
</template>

<style scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
