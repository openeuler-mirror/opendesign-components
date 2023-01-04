<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <section>
    <OSWitch v-model="switchVal1" shape="normal" loading />
    <OSWitch v-model="switchVal2" shape="round" loading />
  </section>
</template>
