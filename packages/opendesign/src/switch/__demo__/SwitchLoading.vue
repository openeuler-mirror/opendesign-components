<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
const switchVal4 = ref(true);
</script>

<template>
  <h4>Loading</h4>
  <section>
    <OSwitch v-model="switchVal1" loading />
    <OSwitch v-model="switchVal2" loading />
    <OSwitch v-model="switchVal3" round="pill" loading />
    <OSwitch v-model="switchVal4" round="pill" loading />
  </section>
</template>
