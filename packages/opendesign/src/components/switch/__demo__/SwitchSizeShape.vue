<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <h4>Size</h4>
  <section>
    <OSWitch v-model="switchVal1" size="small" />
    <OSWitch v-model="switchVal1" size="normal" />
    <OSWitch v-model="switchVal1" size="large" />
  </section>
  <h4>Round</h4>
  <section>
    <OSWitch v-model="switchVal2" shape="round" size="small" />
    <OSWitch v-model="switchVal2" shape="round" size="normal" />
    <OSWitch v-model="switchVal2" shape="round" size="large" />
  </section>
</template>
