<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(NaN);
const event = ref('--');

const printEvent = (evt: string, val?: number) => {
  console.log(`[${evt}]`, val ?? '', 'value:', val1.value);
  event.value = evt;
};

const format = (val: string | number) => (Number.isNaN(val) ? '' : `$${val ?? ''}`);
</script>
<template>
  <h4>Event</h4>
  <div>val1:{{ val1 }}</div>
  <section>
    <div>
      <OInputNumber
        v-model="val1"
        :min="-2"
        :max="5"
        style="width: 200px"
        @blur="() => printEvent('blur')"
        @minus="(v) => printEvent('minus', v)"
        @plus="(v) => printEvent('plus', v)"
        @change="(v) => printEvent('change', v)"
        @input="() => printEvent('input')"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
      />
      value: {{ val1 }}; event:{{ event }};
    </div>
  </section>
  <section>
    <div>
      <OInputNumber
        v-model="val1"
        :min="-2"
        :max="15"
        style="width: 200px"
        :format="format"
        @blur="() => printEvent('blur')"
        @minus="(v) => printEvent('minus', v)"
        @plus="(v) => printEvent('plus', v)"
        @change="(v) => printEvent('change', v)"
        @input="() => printEvent('input')"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
      />
      value: {{ val1 }}; event:{{ event }};
    </div>
  </section>
</template>
<style lang="scss"></style>
