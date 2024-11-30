<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '../index';

const val1 = ref('');
const val3 = ref('');
const val2 = ref('this is input value');
setTimeout(() => {
  // val1.value += '---';
}, 2000);

const printEvent = (event: string, val?: string | number) => {
  console.log(`[${event}]`, val);
};

const beforeInput = (val: string) => {
  return val.trim();
};
</script>
<template>
  <h4>Color & Variant</h4>
  <section>
    <div>Outline</div>
    <div class="row">
      <OTextarea v-model="val1" placeholder="normal + outline" resize="none" clearable style="width: 250px" />
      <OTextarea v-model="val1" color="success" placeholder="success + outline" clearable />
      <OTextarea v-model="val1" color="warning" placeholder="warning + outline" clearable />
      <OTextarea v-model="val1" color="danger" placeholder="danger + outline" clearable />
    </div>
    <div>Solid</div>
    <div class="row">
      <OTextarea v-model="val3" variant="solid" placeholder="normal + solid" />
      <OTextarea v-model="val3" variant="solid" color="success" placeholder="success + solid" />
      <OTextarea v-model="val3" variant="solid" color="warning" placeholder="warning + solid" />
      <OTextarea v-model="val3" variant="solid" color="danger" placeholder="danger + solid" />
    </div>
  </section>
  <h4>Size & Round</h4>
  <div>
    <section>
      <div>default</div>
      <div class="row" style="align-items: flex-start">
        <OTextarea v-model="val1" size="small" placeholder="small" />
        <OTextarea v-model="val1" size="medium" resize="both" placeholder="medium" />
        <OTextarea v-model="val1" size="large" placeholder="large" />
      </div>
      <div>round="pill"</div>
      <div class="row" style="align-items: flex-start">
        <OTextarea v-model="val1" size="small" round="pill" placeholder="small" />
        <OTextarea v-model="val1" size="medium" resize="both" round="pill" placeholder="medium" />
        <OTextarea v-model="val1" size="large" round="pill" placeholder="large" />
      </div>
      <div>round="12px"</div>
      <div class="row" style="align-items: flex-start">
        <OTextarea v-model="val1" size="small" round="12px" />
        <OTextarea v-model="val1" size="medium" resize="both" round="12px" />
        <OTextarea v-model="val1" size="large" round="12px" />
      </div>
    </section>
  </div>

  <h4>Disabled</h4>
  <section>
    <div>Outline</div>
    <div class="row">
      <OTextarea v-model="val1" placeholder="normal + outline" disabled />
      <OTextarea v-model="val1" color="success" placeholder="success + outline" disabled />
      <OTextarea v-model="val1" color="warning" placeholder="warning + outline" disabled />
      <OTextarea v-model="val1" color="danger" placeholder="danger + outline" disabled />
    </div>
    <div>Solid</div>
    <div class="row">
      <OTextarea v-model="val3" variant="solid" placeholder="normal + solid" disabled />
      <OTextarea v-model="val3" variant="solid" color="success" placeholder="success + solid" disabled />
      <OTextarea v-model="val3" variant="solid" color="warning" placeholder="warning + solid" disabled />
      <OTextarea v-model="val3" variant="solid" color="danger" placeholder="danger + solid" disabled />
    </div>
  </section>
  <h4>Resize</h4>
  <section>
    <div>
      <div>both:</div>
      <OTextarea v-model="val1" resize="both" />
    </div>
    <div>
      <div>horizontal:</div>
      <OTextarea v-model="val1" resize="h" />
    </div>
    <div>
      <div>vertical:(default)</div>
      <OTextarea v-model="val1" resize="v" />
    </div>
    <div>
      <div>none:</div>
      <OTextarea v-model="val1" resize="none" />
    </div>
  </section>
  <h4>MaxLength</h4>
  <section>
    <div>
      <div>MaxLength: 10 | val2:{{ val2 }}</div>
      <OTextarea v-model="val2" :max-length="10" />
    </div>
    <div>
      <div>input-out-limit：超出长度时不能输入</div>
      <OTextarea v-model="val2" :max-length="10" :input-on-outlimit="false" />
    </div>
  </section>
  <h4>Clearable</h4>
  <section>
    <div>clearable="false"</div>
    <OTextarea v-model="val1" :max-length="10" size="large" :clearable="false" />
  </section>
  <h4>beforeInput</h4>
  <section>
    <div>输入内容不允许收尾有空格</div>
    <OTextarea v-model="val1" :max-length="10" size="large" :clearable="false" :before-input="beforeInput" />
  </section>
</template>
<style lang="scss"></style>
