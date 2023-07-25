<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal = ref(0);
</script>

<template>
  <h4>不同尺寸</h4>
  <section>
    <ORate v-model="rateVal" />
    <ORate v-model="rateVal" size="large" />
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
