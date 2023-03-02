<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';

const selectVal = ref('option 1');
const selectVal2 = ref('');
const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
];
</script>
<template>
  <h4>Option Position</h4>
  <section>
    <div>
      <span>TL:</span>
      <OSelect v-model="selectVal" option-position="tl">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>TOP:</span>
      <OSelect v-model="selectVal2" option-position="top" trigger="hover" placeholder="on hover">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>TR:</span>
      <OSelect v-model="selectVal2" option-position="tr">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>BL:</span>
      <OSelect v-model="selectVal2" option-position="bl">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>BOTTOM:</span>
      <OSelect v-model="selectVal2" option-position="bottom">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>BR:</span>
      <OSelect v-model="selectVal2" option-position="br">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>LT:</span>
      <OSelect v-model="selectVal2" option-position="lt">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>LEFT:</span>
      <OSelect v-model="selectVal2" option-position="left">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>LB:</span>
      <OSelect v-model="selectVal2" option-position="lb">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>RT:</span>
      <OSelect v-model="selectVal2" option-position="rt">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>RIGHT:</span>
      <OSelect v-model="selectVal2" option-position="right">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>
      <span>RB:</span>
      <OSelect v-model="selectVal2" option-position="rb">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
