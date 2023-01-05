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
  <h4>Option Position</h4>
  <section>
    <div>
      <span>TL:</span
      ><OSelect v-model="selectVal" option-position="tl">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>TOP:</span
      ><OSelect v-model="selectVal2" option-position="top" trigger="hover">
        <OOption :value="options[0].value" />
        <OOption :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>TR:</span
      ><OSelect v-model="selectVal2" option-position="tr">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>BL:</span
      ><OSelect v-model="selectVal2" option-position="bl">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>BOTTOM:</span
      ><OSelect v-model="selectVal2" option-position="bottom">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>BR:</span
      ><OSelect v-model="selectVal2" option-position="br">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>LT:</span
      ><OSelect v-model="selectVal2" option-position="lt">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>LEFT:</span
      ><OSelect v-model="selectVal2" option-position="left">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>LB:</span
      ><OSelect v-model="selectVal2" option-position="lb">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>RT:</span
      ><OSelect v-model="selectVal2" option-position="rt">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>RIGHT:</span
      ><OSelect v-model="selectVal2" option-position="right">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
    <div>
      <span>RB:</span
      ><OSelect v-model="selectVal2" option-position="rb">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
      </OSelect>
    </div>
  </section>
</template>
<style lang="scss" scoped>
section {
  span {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 12px;
  }
}
</style>
