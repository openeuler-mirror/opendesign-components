<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <section>
    <OSWitch v-model="switchVal1" shape="normal" size="small" />
    <OSWitch v-model="switchVal1" shape="normal" size="normal" />
    <OSWitch v-model="switchVal1" shape="normal" size="large" />
    <OSWitch v-model="switchVal2" shape="round" size="small" />
    <OSWitch v-model="switchVal2" shape="round" size="normal" />
    <OSWitch v-model="switchVal2" shape="round" size="large" />
  </section>
</template>
