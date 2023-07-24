<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
const checkboxVal = ref([1]);
</script>

<template>
  <h4>禁用状态</h4>
  <section>
    <OCheckbox v-model="checkboxVal" :value="1" disabled>选项1</OCheckbox>
    <OCheckbox v-model="checkboxVal" :value="2" disabled>选项2</OCheckbox>
  </section>
</template>
