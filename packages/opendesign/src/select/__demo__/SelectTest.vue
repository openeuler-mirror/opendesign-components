2
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';
const options = [
  { label: 'option 1', value: 0 },
  { label: 'option 2', value: 'opt2' },
  { label: 'option 3', value: '' },
  { label: 'option 4', value: 'opt4' },
];
const selectVal1 = ref<number | string>(0);

watchEffect(() => {
  console.log(selectVal1.value);
});
</script>
<template>
  <h4>Issue: <a href="https://gitee.com/openeuler/opendesign-components/pulls/190">#I9H2IP</a></h4>

  <div>selectVal1: {{ selectVal1 }}</div>
  <section>
    <OSelect v-model="selectVal1" placeholder="select..." clearable>
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" />
      <OOption :label="options[2].label" :value="options[2].value" />
      <OOption :label="options[3].label" :value="options[3].value" />
    </OSelect>
  </section>
</template>
<style lang="scss"></style>
