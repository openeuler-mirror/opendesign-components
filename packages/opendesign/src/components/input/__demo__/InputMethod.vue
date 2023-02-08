<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val2 = ref('1234');
const format = (val: string | number) => (val ? `$${val}` : '');
const parse = (val: string) => val.replace(/^\$/g, '');

const printEvent = (evt: string, val?: string | number) => {
  console.log(`[${evt}]`, val);
};
</script>
<template>
  <h4>Parse & Format</h4>
  <section>
    <div>val2:{{ val2 }}</div>
    <OInput
      v-model="val2"
      :format="format"
      :parse="parse"
      @blur="(v) => printEvent('blur', v)"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="(v) => printEvent('focus', v)"
      @press-enter="(v) => printEvent('press-enter', v)"
    />
  </section>
</template>
<style lang="scss"></style>
