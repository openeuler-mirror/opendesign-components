<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';

const switchVal1 = ref(false);

const handleChange = (val: string | number | boolean) => {
  console.log(val);
};
</script>

<template>
  <h4>Change事件</h4>
  <section>
    <OSWitch v-model="switchVal1" round="pill" @change="handleChange" />
  </section>
</template>
