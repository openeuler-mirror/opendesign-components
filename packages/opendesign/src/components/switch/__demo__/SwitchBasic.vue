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
    <OSWitch v-model="switchVal1" size="medium" />
    <OSWitch v-model="switchVal1" size="large" />

    <OSWitch v-model="switchVal2" round="pill" size="small" />
    <OSWitch v-model="switchVal2" round="pill" size="medium" />
    <OSWitch v-model="switchVal2" round="pill" size="large" />
  </section>
</template>
