<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(0);
const event = ref('--');

const printEvent = (evt: string, val?: string | number) => {
  console.log(evt, val);
  event.value = evt;
};
</script>
<template>
  <h4>Event</h4>
  <div>val1:{{ val1 }}</div>
  <section>
    <div>
      <OInputNumber
        v-model="val1"
        @blur="(v) => printEvent('blur', v)"
        @change="(v) => printEvent('change', v)"
        @input="(v) => printEvent('input', v)"
        @focus="(v) => printEvent('focus', v)"
        @press-enter="(v) => printEvent('press-enter', v)"
      />
      value: {{ val1 }}; event:{{ event }};
    </div>
  </section>
</template>
<style lang="scss"></style>
