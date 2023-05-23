<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
const switchVal4 = ref(true);
</script>

<template>
  <h4>Disabled</h4>
  <section>
    <OSwitch v-model="switchVal1" disabled />
    <OSwitch v-model="switchVal2" disabled />
    <OSwitch v-model="switchVal3" round="pill" disabled />
    <OSwitch v-model="switchVal4" round="pill" disabled />
  </section>
</template>
