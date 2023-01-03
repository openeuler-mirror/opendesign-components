<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';

const selectVal = ref('opt1');
const selectVal2 = ref('');
const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'option 2', value: 'opt2' },
];
</script>
<template>
  <h4>popup position</h4>
  <section>
    <OSelect v-model="selectVal" option-position="tl">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="top">
      <OOption :value="options[0].value" />
      <OOption :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="tr">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="bl">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="bottom">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="br">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>

    <OSelect v-model="selectVal2" option-position="lt">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="left">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="lb">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>

    <OSelect v-model="selectVal2" option-position="rt">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="right">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
    <OSelect v-model="selectVal2" option-position="rb">
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" disabled />
    </OSelect>
  </section>
</template>
<style lang="scss" scoped>
section > * {
  margin: 40px;
}
</style>
