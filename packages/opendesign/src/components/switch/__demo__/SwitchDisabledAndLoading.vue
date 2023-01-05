<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <h4>Disabled & Loading</h4>
  <section>
    <OSWitch v-model="switchVal1" loading />
    <OSWitch v-model="switchVal2" shape="round" loading />
  </section>
</template>
