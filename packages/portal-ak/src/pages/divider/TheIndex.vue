<script setup lang="ts">
import { ODivider } from '@components/index';
</script>

<template>
  <div class="page-demo">
    <h3>横向</h3>
    <section :style="{ width: '200px', gap: 0 }">
      <ODivider />
      <span :style="{ 'margin-bottom': '8px' }">浅色背景</span>
      <ODivider darker />
      <span>深色背景</span>
    </section>

    <h3>竖向</h3>
    <section :style="{ width: '200px' }">
      <div>
        <span>浅色背景</span>
        <ODivider direction="v" />
        <span>浅色背景</span>
      </div>
      <div>
        <span>深色背景</span>
        <ODivider direction="v" darker />
        <span>深色背景</span>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
