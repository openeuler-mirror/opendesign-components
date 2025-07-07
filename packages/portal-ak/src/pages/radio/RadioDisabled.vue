<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '@opendesign-src/index';
const radioVal = ref('1');
</script>

<template>
  <h3>禁用</h3>
  <section>
    <ORadio v-model="radioVal" value="1" disabled>选项1</ORadio>
    <ORadio v-model="radioVal" value="2" disabled>选项2</ORadio>
  </section>
</template>
