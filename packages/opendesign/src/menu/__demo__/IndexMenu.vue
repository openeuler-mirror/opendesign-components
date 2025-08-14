<script setup lang="ts">
import '../style';
import MenuBasic from './MenuBasic.vue';
import MenuAccordion from './MenuAccordion.vue';
import MenuSize from './MenuSize.vue';
</script>

<template>
  <div class="page-demo">
    <MenuBasic />
    <MenuAccordion />
    <MenuSize />
  </div>
</template>

<style scoped>
.page-demo {
  background-color: var(--o-color-fill2);
}
</style>