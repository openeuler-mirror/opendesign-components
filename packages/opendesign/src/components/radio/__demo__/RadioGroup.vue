<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '../index';
import { ORadioGroup } from '../../radio-group';

const radioVal1 = ref(1);
const radioVal2 = ref('a');
</script>

<template>
  <h4>单选框组</h4>
  <section>
    <ORadioGroup v-model="radioVal1">
      <ORadio :value="1">选项1</ORadio>
      <ORadio :value="2">选项2</ORadio>
      <ORadio :value="3">选项3</ORadio>
    </ORadioGroup>
  </section>

  <section>
    <ORadioGroup v-model="radioVal2" direction="vertical">
      <ORadio value="a">选项A</ORadio>
      <ORadio value="b">选项B</ORadio>
      <ORadio value="c">选项C</ORadio>
    </ORadioGroup>
  </section>
</template>
