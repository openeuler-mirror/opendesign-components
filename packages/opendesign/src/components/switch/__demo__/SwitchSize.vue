<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
const switchVal4 = ref(true);
</script>

<template>
  <h4>不同尺寸</h4>
  <section>
    <OSwitch v-model="switchVal1" size="small" />
    <OSwitch v-model="switchVal2" round="pill" size="small" />
    <OSwitch v-model="switchVal3" />
    <OSwitch v-model="switchVal4" round="pill" />
  </section>
</template>
