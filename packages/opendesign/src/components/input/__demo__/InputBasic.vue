<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(12345);
</script>
<template>
  <h4>Basic</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val1" />
    <OInput v-model="val2" />
    <OInput v-model="val3" />
    <OInput v-model="val3" />
    <OInput v-model="val3" type="password" />
  </section>
</template>
<style lang="scss"></style>
