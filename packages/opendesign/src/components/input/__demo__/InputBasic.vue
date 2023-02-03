<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
setTimeout(() => {
  val2.value += '---';
}, 2000);

const printEvent = (event: string, val?: string) => {
  console.log(event, val);
};
</script>
<template>
  <h4>Basic</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val1" />
    <OInput
      v-model="val2"
      @blur="() => printEvent('blur')"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="printEvent('focus')"
      @press-enter="(v) => printEvent('press-enter', v)"
    />
    <OInput v-model="val3" />
    <OInput v-model="val3" />
    <OInput v-model="val3" type="password" />
  </section>
</template>
<style lang="scss"></style>
