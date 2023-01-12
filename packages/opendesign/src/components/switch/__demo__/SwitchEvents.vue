<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';

const switchVal1 = ref(false);

const handleChange = (val: boolean) => {
  console.log(val);
};
</script>

<template>
  <h4>change事件</h4>
  <section>
    <OSWitch v-model="switchVal1" shape="round" @change="handleChange" />
  </section>
</template>
