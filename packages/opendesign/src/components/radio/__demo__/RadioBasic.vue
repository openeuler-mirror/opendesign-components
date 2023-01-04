<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '../index';
const radioVal = ref(1);
</script>

<template>
  <section>
    <ORadio v-model="radioVal" :value="1">选项1</ORadio>
    <ORadio v-model="radioVal" :value="2">选项2</ORadio>
  </section>
</template>
