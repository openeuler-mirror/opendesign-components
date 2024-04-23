<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

function numberWithCommas(x: number | string) {
  return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const val2 = ref('123456');
const format = (val: string | number) => {
  console.log('format', val);

  return val ? `$${numberWithCommas(val)}` : '';
};

const printEvent = (evt: string, v?: string) => {
  console.log(`[${evt}]`, v ?? '', 'value:', val2.value);
};
</script>
<template>
  <h4>Parse & Format</h4>
  <section>
    <div>val2:{{ val2 }}</div>
    <OInput
      v-model="val2"
      :format="format"
      placeholder="inputing..."
      @clear="() => printEvent('clear')"
      @blur="() => printEvent('blur')"
      @change="(v) => printEvent('change', v)"
      @input="() => printEvent('input')"
      @focus="() => printEvent('focus')"
      @press-enter="() => printEvent('press-enter')"
    />
    <OInput
      v-model="val2"
      :format="format"
      placeholder="inputing..."
      @clear="() => printEvent('clear')"
      @blur="() => printEvent('blur')"
      @change="(v) => printEvent('change', v)"
      @input="() => printEvent('input')"
      @focus="() => printEvent('focus')"
      @press-enter="() => printEvent('press-enter')"
    />
  </section>
</template>
<style lang="scss"></style>
