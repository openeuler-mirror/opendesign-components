<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(0);
setTimeout(() => {
  val1.value = 3;
}, 2000);
const val2 = ref(100);
const val3 = ref(3333);
const val4 = ref(1);
const val5 = ref(10);
</script>
<template>
  <h4>Base</h4>
  <div>val1:{{ val1 }}</div>
  <section>
    <div class="col">
      v-model, clear-value=0
      <OInputNumber v-model="val1" style="width: 150px" :clear-value="0" />
    </div>
    <div class="col">
      model-value, clear-value=1
      <OInputNumber :model-value="val1" style="width: 150px" :clear-value="1" />
    </div>
    <div class="col">
      default-value, clear-value=9
      <OInputNumber :default-value="val1" style="width: 150px" :clear-value="9" />
    </div>
  </section>
  <h4>Color & Variant</h4>
  <section>
    <div class="row">
      <div>
        <p>normal</p>
        <OInputNumber v-model="val1" style="width: 150px" color="normal" />
      </div>
      <div>
        <p>success</p>
        <OInputNumber v-model="val1" style="width: 150px" color="success" />
      </div>
      <div>
        <p>warning</p>
        <OInputNumber v-model="val1" style="width: 150px" color="warning" />
      </div>
      <div>
        <p>danger</p>
        <OInputNumber v-model="val1" style="width: 150px" color="danger" />
      </div>
    </div>
    <div class="row">
      <OInputNumber v-model="val1" style="width: 150px" color="normal" variant="solid" />
      <OInputNumber v-model="val1" style="width: 150px" color="success" variant="solid" />
      <OInputNumber v-model="val1" style="width: 150px" color="warning" variant="solid" />
      <OInputNumber v-model="val1" style="width: 150px" color="danger" variant="solid" />
    </div>
  </section>
  <section>
    <div class="col">
      readonly:
      <OInputNumber v-model="val1" readonly :max="5" :min="0" />
    </div>
    <div class="col">
      controls both:
      <OInputNumber v-model="val1" controls="both" :max="5" :min="0" />
    </div>
    <div class="col">
      controls none:
      <OInputNumber v-model="val1" controls="none" />
    </div>
    <div class="col">
      controls left:
      <OInputNumber v-model="val1" controls="left" />
    </div>
    <div class="right">
      controls right:
      <OInputNumber v-model="val1" controls="right" :max="5" :min="0" />
    </div>
  </section>
  <h4>Size</h4>
  <div>val2:{{ val2 }}</div>
  <section>
    <OInputNumber v-model="val2" size="small" />
    <OInputNumber v-model="val2" />
    <OInputNumber v-model="val3" size="large" />
  </section>
  <h4>Auto width</h4>
  <section><OInputNumber v-model="val5" :step="100" auto-width /> {{ val5 }}</section>
  <h4>Round</h4>
  <section>
    <div>
      <p>pill</p>
      <section>
        <OInputNumber v-model="val2" size="small" round="pill" />
        <OInputNumber v-model="val2" round="pill" />
        <OInputNumber v-model="val3" size="large" round="pill" />

        <OInputNumber v-model="val2" size="small" round="pill" controls="none" />
        <OInputNumber v-model="val2" round="pill" controls="none" />
        <OInputNumber v-model="val3" size="large" round="pill" controls="none" />
      </section>
    </div>
    <div>
      <p>16px</p>
      <section>
        <OInputNumber v-model="val2" size="small" round="16px" controls="none" />
        <OInputNumber v-model="val2" round="16px" controls="none" />
        <OInputNumber v-model="val3" size="large" round="16px" controls="none" />
      </section>
    </div>
  </section>
  <h4>Disabled</h4>
  <section>
    <div class="row">
      <OInputNumber v-model="val1" disabled />
      <OInputNumber v-model="val1" disabled style="width: 150px">
        <template #prefix>$</template>
      </OInputNumber>
      <OInputNumber v-model="val1" disabled style="width: 150px">
        <template #suffix> 元 </template>
      </OInputNumber>
    </div>

    <div class="row">
      <OInputNumber v-model="val1" style="width: 150px" color="normal" variant="solid" disabled />
      <OInputNumber v-model="val1" style="width: 150px" color="success" variant="solid" disabled />
      <OInputNumber v-model="val1" style="width: 150px" color="warning" variant="solid" disabled />
      <OInputNumber v-model="val1" style="width: 150px" color="danger" variant="solid" disabled />
    </div>
  </section>

  <h4>Step & min & max</h4>
  <section>
    <div>val4:{{ val4 }}</div>
    <OInputNumber v-model="val4" :step="2" />
    <OInputNumber v-model="val4" :min="1" style="width: 150px">
      <template #prefix>$</template>
    </OInputNumber>
    <OInputNumber v-model="val4" :max="5" style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
    <OInputNumber v-model="val4" :step="3" :min="3" :max="8" style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
  </section>
</template>
<style lang="scss"></style>
