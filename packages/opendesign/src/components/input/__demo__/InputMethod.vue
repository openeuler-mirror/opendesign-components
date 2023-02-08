<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('');
const val2 = ref('this is input value');
const format = (val: string | number) => (val ? `$${val}` : '');
const parse = (val: string) => val.replace(/^\$/g, '');
</script>
<template>
  <h4>Parse & Format</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" :format="format" :parse="parse" />
  </section>
</template>
<style lang="scss"></style>
