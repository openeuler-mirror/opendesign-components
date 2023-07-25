<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
import { OCheckboxGroup } from '../../checkbox-group';

const checkboxVal1 = ref([1]);
const checkboxRef1 = ref<InstanceType<typeof OCheckbox> | null>(null);
const handleChange1 = () => {
  console.log('选项1 checked: ', checkboxRef1.value?.checked);
};

const checkBoxVal2 = ref([1]);
const checkBoxRef2 = ref<InstanceType<typeof OCheckbox> | null>(null);
const handleChange2 = (val: Array<string | number>) => {
  console.log('多选框model-value: ', val);
  console.log('选项1 checked: ', checkBoxRef2.value?.checked);
};
</script>

<template>
  <h4>Change事件</h4>
  <section>
    <OCheckbox ref="checkboxRef1" v-model="checkboxVal1" :value="1" @change="handleChange1">选项1</OCheckbox>
    <OCheckbox v-model="checkboxVal1" :value="2" @change="handleChange1">选项2</OCheckbox>
  </section>

  <section>
    <OCheckboxGroup v-model="checkBoxVal2" @change="handleChange2">
      <OCheckbox ref="checkBoxRef2" :value="1">选项1</OCheckbox>
      <OCheckbox :value="2">选项2</OCheckbox>
      <OCheckbox :value="3">选项3</OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
