<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox, OCheckboxGroup } from '@components/index';

const checkboxVal1 = ref<Array<string>>([]);
const indeterminate = ref(false);

const checkboxVal2 = ref<Array<number>>([]);

const handleChangeAll = (val: Array<string | number>) => {
  indeterminate.value = false;
  if (val[0] === 'a') {
    checkboxVal2.value = [1, 2, 3];
  } else {
    checkboxVal2.value = [];
  }
};
const handleChange = (val: Array<string | number>) => {
  if (val.length === 3) {
    checkboxVal1.value = ['a'];
    indeterminate.value = false;
  } else if (val.length === 0) {
    checkboxVal1.value = [];
    indeterminate.value = false;
  } else {
    checkboxVal1.value = [];
    indeterminate.value = true;
  }
};
</script>

<template>
  <h3>半选</h3>
  <section>
    <OCheckbox v-model="checkboxVal1" value="a" :indeterminate="indeterminate" @change="handleChangeAll">Check All </OCheckbox>

    <OCheckboxGroup v-model="checkboxVal2" @change="handleChange">
      <OCheckbox :value="1">Option 1</OCheckbox>
      <OCheckbox :value="2">Option 2</OCheckbox>
      <OCheckbox :value="3">Option 3</OCheckbox>
    </OCheckboxGroup>
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
