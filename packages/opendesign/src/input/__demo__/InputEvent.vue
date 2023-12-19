<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val2 = ref('192-168-1-0');
const event = ref('--');

const printEvent = (evt: string, val?: string | number) => {
  console.log(`[${evt}]`, val);
  event.value = evt;
};
const changeVal = () => {
  val2.value += '-|-';
};
const check = (v: string) => {
  return v.length % 2 === 0;
  // return true;
};
const format = (v: string) => {
  return v.replaceAll('-', '.');
};
const parse = (v: string) => {
  const val = parseInt(v);
  return val ? `${val}` : '';
};
</script>
<template>
  <h4>Event</h4>
  <section>
    <OInput
      v-model="val2"
      :check-valid="check"
      :format="format"
      :parse="parse"
      @blur="(v) => printEvent('blur', v)"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="(v) => printEvent('focus', v)"
      @press-enter="(v) => printEvent('press-enter', v)"
      @clear="() => printEvent('clear')"
    >
      <template #prepend><span style="padding: 0 8px">+86</span></template>
      <template #append><span style="padding: 0 8px">手机</span></template>
    </OInput>
    value: {{ val2 }}; event:{{ event }};
    <button @click="changeVal">change value</button>
  </section>
</template>
<style lang="scss"></style>
