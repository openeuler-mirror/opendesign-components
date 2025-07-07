<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '@opendesign-src/index';

const checkboxVal = ref([1]);
</script>

<template>
  <h3>选中&未选中</h3>
  <section>
    <OCheckbox v-model="checkboxVal" :value="1">选项1</OCheckbox>
    <OCheckbox v-model="checkboxVal" :value="2">选项2</OCheckbox>
  </section>
</template>
