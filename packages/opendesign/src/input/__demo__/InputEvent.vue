<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val2 = ref('this is input value');
const event = ref('--');

const printEvent = (evt: string, val?: string | number) => {
  console.log(`[${evt}]`, val);
  event.value = evt;
};
</script>
<template>
  <h4>Event</h4>
  <section>
    <OInput
      v-model="val2"
      @blur="(v) => printEvent('blur', v)"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="(v) => printEvent('focus', v)"
      @press-enter="(v) => printEvent('press-enter', v)"
    >
      <template #prepend><span style="padding: 0 8px">+86</span></template>
      <template #append><span style="padding: 0 8px">手机</span></template>
    </OInput>
    value: {{ val2 }}; event:{{ event }};
  </section>
</template>
<style lang="scss"></style>
