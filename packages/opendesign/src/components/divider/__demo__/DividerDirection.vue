<script setup lang="ts">
import { ODivider } from '../index';
</script>

<template>
  <h4>垂直方向</h4>
  <section>
    <span>OpenDesign</span>
    <ODivider direction="v" />
    <span>openEuler</span>
    <ODivider direction="v" variant="dashed" />
    <span>开源社区</span>
    <ODivider direction="v" variant="dotted" />
  </section>
</template>

<style lang="scss" scoped>
section {
  gap: 0;
}
</style>
