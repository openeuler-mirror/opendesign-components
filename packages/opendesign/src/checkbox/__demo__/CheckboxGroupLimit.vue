<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
import { OCheckboxGroup } from '../../checkbox-group';
const checkboxVal = ref([1]);
</script>

<template>
  <h4>限制可勾选数量</h4>
  <section>
    <OCheckboxGroup v-model="checkboxVal" :min="1" :max="3">
      <OCheckbox :value="1">选项1</OCheckbox>
      <OCheckbox :value="2">选项2</OCheckbox>
      <OCheckbox :value="3">选项3</OCheckbox>
      <OCheckbox :value="4">选项4</OCheckbox>
      <OCheckbox :value="5">选项5</OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
