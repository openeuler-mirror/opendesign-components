<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox, OCheckboxGroup } from '@components/index';
const checkboxVal1 = ref([1]);
const checkboxVal2 = ref(['a']);
</script>

<template>
  <h3>横向</h3>
  <section>
    <OCheckboxGroup v-model="checkboxVal1">
      <OCheckbox :value="1">选项1</OCheckbox>
      <OCheckbox :value="2">选项2</OCheckbox>
      <OCheckbox :value="3">选项3</OCheckbox>
      <OCheckbox :value="4" :style="{ width: '80px' }">文本换行1</OCheckbox>
      <OCheckbox :value="5" :style="{ width: '80px', '--checkbox-align': 'flex-start' }">文本换行2</OCheckbox>
    </OCheckboxGroup>
  </section>
  <h4>竖向</h4>
  <section>
    <OCheckboxGroup v-model="checkboxVal2" direction="v">
      <OCheckbox value="a">选项A</OCheckbox>
      <OCheckbox value="b">选项B</OCheckbox>
      <OCheckbox value="c">选项C</OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
