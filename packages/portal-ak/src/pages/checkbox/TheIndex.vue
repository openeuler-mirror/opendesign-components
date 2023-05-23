<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox, OCheckboxGroup } from '@components/index';
const checkboxVal1 = ref([1]);
const checkboxVal2 = ref(['1']);

const checkboxVal3 = ref<Array<string>>([]);
const indeterminate = ref(false);

const checkboxVal4 = ref<Array<number>>([]);

const handleChangeAll = (val: Array<string | number>) => {
  indeterminate.value = false;
  if (val[0] === 'a') {
    checkboxVal4.value = [1, 2, 3];
  } else {
    checkboxVal4.value = [];
  }
};
const handleChange = (val: Array<string | number>) => {
  if (val.length === 3) {
    checkboxVal3.value = ['a'];
    indeterminate.value = false;
  } else if (val.length === 0) {
    checkboxVal3.value = [];
    indeterminate.value = false;
  } else {
    checkboxVal3.value = [];
    indeterminate.value = true;
  }
};
</script>

<template>
  <div class="page-demo">
    <h3>选中&未选中</h3>
    <section>
      <OCheckbox v-model="checkboxVal1" :value="1">选项1</OCheckbox>
      <OCheckbox v-model="checkboxVal1" :value="2">选项2</OCheckbox>
    </section>

    <h3>禁用</h3>
    <section>
      <OCheckbox v-model="checkboxVal2" value="1" disabled>选项1</OCheckbox>
      <OCheckbox v-model="checkboxVal2" value="2" disabled>选项2</OCheckbox>
    </section>

    <h3>半选</h3>
    <section :style="{ 'flex-direction': 'column', 'align-items': 'flex-start' }">
      <OCheckbox v-model="checkboxVal3" value="a" :indeterminate="indeterminate" @change="handleChangeAll">Check All </OCheckbox>

      <OCheckboxGroup v-model="checkboxVal4" @change="handleChange">
        <OCheckbox :value="1">Option 1</OCheckbox>
        <OCheckbox :value="2">Option 2</OCheckbox>
        <OCheckbox :value="3">Option 3</OCheckbox>
      </OCheckboxGroup>
    </section>
  </div>
</template>
'
