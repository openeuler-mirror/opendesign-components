<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal = ref(2.5);
const handleChange = (val: number) => {
  console.log(val);
};
</script>

<template>
  <h4>允许半选</h4>
  <section>
    <ORate v-model="rateVal" allow-half @change="handleChange" />
  </section>
</template>
