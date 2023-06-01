<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '@components/index';

const rateVal1 = ref(3);
const rateVal2 = ref(3);

const handleChange = (val: number) => {
  console.log(val);
};
</script>

<template>
  <h3>不同尺寸</h3>
  <section>
    <ORate v-model="rateVal1" color="primary" @change="handleChange" />
    <ORate :default-value="rateVal2" color="primary" size="large" @change="handleChange" />
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
