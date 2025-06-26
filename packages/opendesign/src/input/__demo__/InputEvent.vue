<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val2 = ref('192-168-1-0');
const event = ref('--');

const printEvent = (evt: string, val?: string) => {
  console.log(`[${evt}]`, val ?? '', 'value:', val2.value);
  event.value = evt;
};
const changeVal = () => {
  val2.value += `-${Math.floor(Math.random() * 100)}`;
};
const format = (v: string) => {
  return v.replace(/-/g, '.');
};

const inputRef = ref<InstanceType<typeof OInput>>();
const focus = () => {
  // console.log(inputRef.value?.focus);
  inputRef.value?.focus();
};
const blur = () => {
  inputRef.value?.blur();
};

const clear = () => {
  inputRef.value?.clear();
};

const togglePassword = () => {
  inputRef.value?.togglePassword();
};
</script>
<template>
  <h4>Event</h4>
  <section>
    <OInput
      ref="inputRef"
      v-model="val2"
      :format="format"
      @blur="() => printEvent('blur')"
      @change="(v) => printEvent('change', v)"
      @input="() => printEvent('input')"
      @focus="() => printEvent('focus')"
      @press-enter="() => printEvent('press-enter')"
      @clear="() => printEvent('clear')"
    >
      <template #prepend><span style="padding: 0 8px">+86</span></template>
      <template #append><span style="padding: 0 8px">手机</span></template>
    </OInput>
    value: {{ val2 }}; event:{{ event }};
    <button @click="changeVal">change value</button>
    <button @click="focus">focus</button>
    <button @click="blur">blur</button>
    <button @click="clear">clear</button>
    <button @click="togglePassword">togglePassword</button>
  </section>
</template>
<style lang="scss"></style>
