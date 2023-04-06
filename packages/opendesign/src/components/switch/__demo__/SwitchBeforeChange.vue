<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';

const switchVal1 = ref(false);
const loading1 = ref(false);
let cnt = 0;
const beforeChange1 = (): Promise<boolean> => {
  loading1.value = true;
  cnt += 1;
  return new Promise((resolve) => {
    setTimeout(() => {
      loading1.value = false;
      return resolve(cnt % 2 === 0);
    }, 1000);
  });
};

const switchVal2 = ref(true);
const beforeChange2 = () => {
  cnt += 1;
  return cnt % 2 === 0;
};
</script>

<template>
  <h4>阻止切换</h4>
  <section>
    <OSWitch v-model="switchVal1" :loading="loading1" :before-change="beforeChange1" />
    <OSWitch v-model="switchVal2" round="pill" :before-change="beforeChange2" />
  </section>
</template>
