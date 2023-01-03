<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';
const selectVal = ref('opt1');
const selectVal2 = ref('');
const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'long long long long long long long long long long long long text option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
];
</script>
<template>
  <h4>Size</h4>
  <section>
    <OSelect v-model="selectVal" size="large">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" />
      <OOption :label="options[2].label" :value="options[2].value" />
      <OOption :label="options[3].label" :value="options[3].value" />
    </OSelect>

    <OSelect v-model="selectVal2">
      <OOption :value="options[0].value" />
      <OOption :value="options[1].value" disabled />
    </OSelect>

    <OSelect v-model="selectVal2" size="small">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
      <OOption :label="options[2].label" :value="options[2].value" />
      <OOption :label="options[3].label" :value="options[3].value" />
    </OSelect>
  </section>
</template>
<style lang="scss"></style>
