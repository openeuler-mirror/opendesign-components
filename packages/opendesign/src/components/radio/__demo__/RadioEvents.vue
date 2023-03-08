<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '../index';
import { ORadioGroup } from '../../radio-group';

const radioVal1 = ref(1);
const radioRef1 = ref<InstanceType<typeof ORadio> | null>(null);
const handleChange1 = () => {
  console.log('选项1 checked: ', radioRef1.value?.checked);
};

const radioVal2 = ref(1);
const radioRef2 = ref<InstanceType<typeof ORadio> | null>(null);
const handleChange2 = (val: string | number | boolean) => {
  console.log('单选框model-value: ', val);
  console.log('选项1 checked: ', radioRef2.value?.checked);
};
</script>

<template>
  <h4>Change事件</h4>
  <section>
    <ORadio ref="radioRef1" v-model="radioVal1" :value="1" @change="handleChange1">选项1</ORadio>
    <ORadio v-model="radioVal1" :value="2" @change="handleChange1">选项2</ORadio>
  </section>

  <section>
    <ORadioGroup v-model="radioVal2" @change="handleChange2">
      <ORadio ref="radioRef2" :value="1">选项1</ORadio>
      <ORadio :value="2">选项2</ORadio>
      <ORadio :value="3">选项3</ORadio>
    </ORadioGroup>
  </section>
</template>
