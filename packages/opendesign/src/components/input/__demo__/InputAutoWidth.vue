<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('max width: 300px');
const val2 = ref('min width: 100px');
setTimeout(() => {
  val1.value = '123';
}, 2000);
</script>
<template>
  <h4>Auto Width</h4>
  <section>
    <OInput v-model="val1" auto-width style="max-width: 300px" />
    <OInput v-model="val2" auto-width style="min-width: 200px" />
  </section>
</template>
<style lang="scss"></style>
