<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch, SwitchShapeT } from '../index';

const switchVal1 = ref(false);
const loading1 = ref(false);
const beforeChange1 = (): Promise<boolean> => {
  loading1.value = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      loading1.value = false;
      return resolve(true);
    }, 1000);
  });
};

const switchVal2 = ref(true);
const loading2 = ref(false);
const beforeChange2 = (): Promise<boolean> => {
  loading2.value = true;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      loading2.value = false;
      return reject(new Error('Error'));
    }, 1000);
  });
};
</script>

<template>
  <section>
    <OSWitch
      v-model="switchVal1"
      :shape="SwitchShapeT.NORMAL"
      :loading="loading1"
      :before-change="beforeChange1"
    />
    <OSWitch
      v-model="switchVal2"
      :shape="SwitchShapeT.ROUND"
      :loading="loading2"
      :before-change="beforeChange2"
    />
  </section>
</template>
