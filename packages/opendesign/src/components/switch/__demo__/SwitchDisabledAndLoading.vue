<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
const switchVal4 = ref(true);
</script>

<template>
  <h4>Disabled & Loading</h4>
  <section>
    <OSWitch v-model="switchVal1" disabled />
    <OSWitch v-model="switchVal2" shape="round" disabled />
    <OSWitch v-model="switchVal3" loading />
    <OSWitch v-model="switchVal4" shape="round" loading />
  </section>
</template>
