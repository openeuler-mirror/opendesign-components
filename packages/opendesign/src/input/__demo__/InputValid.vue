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
const check = (v: string) => {
  return v.length % 2 === 0;
  // return true;
};
const onInvalidChange = (inputValue: string, lastValidInputValue: string, lastValue: string) => {
  console.log('onInvalidChange', inputValue, lastValidInputValue, lastValue);
  return lastValue;
};
</script>
<template>
  <h4>Validate</h4>
  <div>
    <p>设置校验函数，默认输入无效时回车或失焦后,值的纠正为上一次输入有效的值</p>
    <section>
      <OInput
        v-model="val2"
        :format="format"
        :validate="check"
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
    </section>
    <p>设置校验函数，并指定输入无效时回车或失焦后,值的纠正为上一次的值</p>
    <section>
      <OInput
        v-model="val2"
        :format="format"
        :validate="check"
        :onInvalidChange="onInvalidChange"
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
    </section>
  </div>
</template>
<style lang="scss"></style>
