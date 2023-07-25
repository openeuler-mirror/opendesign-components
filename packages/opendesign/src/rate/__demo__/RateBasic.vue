<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal1 = ref(0);
const rateVal2 = ref(0);

const handleChange = (val: number) => {
  console.log(val);
};

let labels = ref(['非常不满意', '不满意', ' 一般', '满意', '非常满意']);
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <ORate v-model="rateVal1" @change="handleChange" />
    <ORate :default-value="rateVal2" :labels="labels" @change="handleChange" />
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
