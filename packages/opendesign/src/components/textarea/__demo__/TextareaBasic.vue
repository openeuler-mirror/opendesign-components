<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '../index';

const val1 = ref('this is input value');
const val2 = ref('this is input value');
setTimeout(() => {
  // val1.value += '---';
}, 2000);

const printEvent = (event: string, val?: string | number) => {
  console.log(`[${event}]`, val);
};
</script>
<template>
  <h4>Clearable</h4>
  <section>
    <OTextarea v-model="val1" :max-length="10" size="large" shape="round" clearable />
  </section>
  <h4>MaxLength</h4>
  <section>
    <div>
      <div>MaxLength: 10 | val2:{{ val2 }}</div>
      <OTextarea v-model="val1" :max-length="10" />
    </div>
    <div>
      <div>input-out-limit：超出长度时不能输入</div>
      <OTextarea v-model="val1" :max-length="10" :input-out-limit="false" />
    </div>
  </section>
  <h4>Size</h4>
  <div>
    <div>val1:{{ val1 }}</div>
    <section style="align-items: flex-start">
      <OTextarea
        v-model="val1"
        size="small"
        @blur="(v) => printEvent('blur', v)"
        @change="(v) => printEvent('change', v)"
        @input="(v) => printEvent('input', v)"
        @focus="(v) => printEvent('focus', v)"
        @keydown="(v) => printEvent('keydown', v)"
      />
      <OTextarea v-model="val1" size="normal" />
      <OTextarea v-model="val1" size="large" />
    </section>
  </div>
  <h4>Round</h4>
  <div>
    <div>val1:{{ val1 }}</div>
    <section style="align-items: flex-start">
      <OTextarea v-model="val1" size="small" shape="round" />
      <OTextarea v-model="val1" size="normal" resize="both" shape="round" />
      <OTextarea v-model="val1" size="large" shape="round" />
    </section>
  </div>
  <h4>Status</h4>
  <section>
    <div>
      <div>success:</div>
      <OTextarea v-model="val1" status="success" />
    </div>
    <div>
      <div>warning:</div>
      <OTextarea v-model="val1" status="warning" />
    </div>
    <div>
      <div>error:(default)</div>
      <OTextarea v-model="val1" status="error" />
    </div>
  </section>
  <h4>Disabled & Readonly</h4>
  <div>
    <div>val1:{{ val1 }}</div>
    <section>
      <OTextarea v-model="val1" disabled />
      <OTextarea v-model="val1" readonly />
    </section>
  </div>
  <h4>Resize</h4>
  <section>
    <div>
      <div>both:</div>
      <OTextarea v-model="val1" resize="both" />
    </div>
    <div>
      <div>horizontal:</div>
      <OTextarea v-model="val1" resize="horizontal" />
    </div>
    <div>
      <div>vertical:(default)</div>
      <OTextarea v-model="val1" resize="vertical" />
    </div>
    <div>
      <div>none:</div>
      <OTextarea v-model="val1" resize="none" />
    </div>
  </section>
</template>
<style lang="scss"></style>
