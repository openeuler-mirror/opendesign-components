<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(NaN);
const event = ref('--');

const printEvent = (evt: string, val?: string | number) => {
  console.log(`[${evt}]`, val);
  event.value = evt;
};

const format = (val: string | number) => (Number.isNaN(val) ? '' : `$${val ?? ''}`);
const parse = (val: string) => val.replace(/^\$/g, '');
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
        @blur="(v) => printEvent('blur', v)"
        @minus="(v) => printEvent('minus', v)"
        @plus="(v) => printEvent('plus', v)"
        @change="(v) => printEvent('change', v)"
        @input="(v) => printEvent('input', v)"
        @focus="(v) => printEvent('focus', v)"
        @press-enter="(v) => printEvent('press-enter', v)"
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
        :parse="parse"
        @blur="(v) => printEvent('blur', v)"
        @minus="(v) => printEvent('minus', v)"
        @plus="(v) => printEvent('plus', v)"
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
