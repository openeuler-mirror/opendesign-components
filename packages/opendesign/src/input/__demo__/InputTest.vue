<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('');
const format = (val: string) => {
  return val.trim();
};
</script>
<template>
  <div>val1:{{ val1 }}</div>
  <section>
    <p>text:</p>
    <OInput v-model="val1" :max-length="5" :min-length="2" :before-input="format" />
  </section>
</template>
<style lang="scss"></style>
