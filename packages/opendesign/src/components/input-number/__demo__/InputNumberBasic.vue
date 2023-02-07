<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';
import { IconDone } from '../../icons';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
const val4 = ref(12345);
setTimeout(() => {
  val2.value += '---';
}, 2000);

const printEvent = (event: string, val?: string | number) => {
  console.log(event, val);
};
</script>
<template>
  <h4>Basic</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInputNumber v-model:value="val1" />
    <OInputNumber
      v-model:value="val2"
      @blur="() => printEvent('blur')"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="printEvent('focus')"
      @press-enter="(v) => printEvent('press-enter', v)"
    />
    <OInputNumber v-model:value="val3" />
  </section>
  <h4>Size</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInputNumber v-model:value="val2" size="small" />
    <OInputNumber v-model:value="val2" />
    <OInputNumber v-model:value="val3" size="large" />
  </section>
  <h4>Disabled</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInputNumber v-model:value="val2" disabled />
    <OInputNumber v-model:value="val2" disabled>
      <template #prefix>
        <IconDone />
      </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" disabled>
      <template #suffix>
        <IconDone />
      </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" :clearable="false" disabled>
      <template #suffix> 元 </template>
    </OInputNumber>
  </section>
</template>
<style lang="scss"></style>
