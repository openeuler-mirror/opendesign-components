<script setup lang="ts">
import { OToggle } from '@components/index';
import { ref } from 'vue';
const checked1 = ref(true);
</script>

<template>
  <h3>单独使用</h3>
  <section>
    <OToggle v-model="checked1">1</OToggle>
    <OToggle>2</OToggle>
    <OToggle>2</OToggle>
  </section>
</template>
