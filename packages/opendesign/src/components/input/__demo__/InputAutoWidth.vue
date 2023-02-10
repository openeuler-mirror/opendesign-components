<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('this is input value this is input value');
const val2 = ref('123');
</script>
<template>
  <h4>Auto Width</h4>
  <section>
    <OInput v-model="val1" auto-width style="max-width: 300px" />
    <OInput v-model="val2" auto-width />
  </section>
</template>
<style lang="scss"></style>
