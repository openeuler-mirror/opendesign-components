<script setup lang="ts">
import { OBadge } from '@components/index';
</script>

<template>
  <h3>基本用法</h3>
  <section>
    <OBadge :value="9"> 消息 </OBadge>
    <OBadge :value="100"> 消息 </OBadge>
    <OBadge dot> 消息 </OBadge>
  </section>
</template>

<style lang="scss" scoped>
section {
  gap: 50px;
}
</style>
