<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '@components/index';
const checkboxVal = ref(['1']);
</script>

<template>
  <h3>禁用</h3>
  <section>
    <OCheckbox v-model="checkboxVal" value="1" disabled>选项1</OCheckbox>
    <OCheckbox v-model="checkboxVal" value="2" disabled>选项2</OCheckbox>
  </section>
</template>
