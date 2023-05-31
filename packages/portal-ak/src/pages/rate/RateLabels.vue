<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '@components/index';

const rateVal = ref(3);

const labels = ref(['非常不满意', '不满意', ' 一般', '满意', '非常满意']);
</script>

<template>
  <h3>带文字提示</h3>
  <section>
    <ORate :default-value="rateVal" :labels="labels" size="large" />
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
