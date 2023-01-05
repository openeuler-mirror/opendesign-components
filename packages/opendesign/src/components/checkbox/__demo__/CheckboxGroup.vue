<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
import { OCheckboxGroup } from '../../checkbox-group';
const checkboxVal1 = ref([1]);
const checkboxVal2 = ref(['a']);
const handleChange = (val: Array<string | number>) => {
  console.log(val);
};
</script>

<template>
  <section>
    <OCheckboxGroup v-model="checkboxVal1">
      <OCheckbox :value="1">选项1</OCheckbox>
      <OCheckbox :value="2">选项2</OCheckbox>
      <OCheckbox :value="3">选项3</OCheckbox>
    </OCheckboxGroup>
  </section>

  <section>
    <OCheckboxGroup v-model="checkboxVal2" direction="vertical" @change="handleChange">
      <OCheckbox value="a">选项A</OCheckbox>
      <OCheckbox value="b">选项B</OCheckbox>
      <OCheckbox value="c">选项C</OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
