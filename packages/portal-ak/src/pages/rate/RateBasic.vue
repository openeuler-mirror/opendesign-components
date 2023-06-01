<script setup lang="ts">
import { ORate } from '@components/index';
</script>

<template>
  <h3>基础用法</h3>
  <section>
    <div class="display-box">
      <ORate color="primary" :default-value="1" readonly :count="1" />
      <span class="rate-label">4.0</span>
    </div>

    <div class="display-box">
      <ORate :default-value="0" color="primary" readonly :count="1" class="rate-empty" />
      <span class="rate-label">暂无评分</span>
    </div>

    <div class="display-box">
      <ORate :default-value="3" color="primary" size="large" />
    </div>
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}

.display-box {
  display: flex;
  align-items: center;
}

.rate-label {
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  margin-left: 8px;
}
</style>
