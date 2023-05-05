<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal = ref(3);
</script>

<template>
  <h4>不同颜色</h4>
  <section>
    <ORate v-model="rateVal" />
    <ORate v-model="rateVal" color="primary" />
    <ORate v-model="rateVal" color="success" />
    <ORate v-model="rateVal" color="warning" />
    <ORate v-model="rateVal" color="danger" />
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
