<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
const checkboxVal = ref(['1']);
</script>

<template>
  <section>
    <OCheckbox v-model="checkboxVal" value="1">选项1</OCheckbox>
    <OCheckbox v-model="checkboxVal" value="2">选项2</OCheckbox>
  </section>
</template>
