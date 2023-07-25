<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal = ref(3);
const handleChange = (val: number) => {
  console.log(val);
};
</script>

<template>
  <h4>可清空</h4>
  <section>
    <ORate v-model="rateVal" clearable @change="handleChange" />
  </section>
</template>
