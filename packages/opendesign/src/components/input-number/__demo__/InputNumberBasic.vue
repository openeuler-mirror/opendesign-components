<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(0);
setTimeout(() => {
  val1.value = 3;
}, 2000);
const val2 = ref(100);
const val3 = ref(3333);
const val4 = ref('1px');
</script>
<template>
  <h4>Basic</h4>
  <div>val1:{{ val1 }}</div>
  <section>
    <div class="col">
      v-model:
      <OInputNumber v-model="val1" style="width: 150px" />
    </div>
    <div class="col">
      model-value:
      <OInputNumber :model-value="val1" style="width: 150px" />
    </div>
    <div class="col">
      default-value:
      <OInputNumber :default-value="val1" style="width: 150px" />
    </div>
  </section>
  <section>
    <div class="col">
      readonly:
      <OInputNumber v-model="val1" readonly />
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
      controls left:
      <OInputNumber v-model="val1" controls="right" :max="5" />
    </div>
  </section>
  <h4>Size</h4>
  <div>val2:{{ val2 }}</div>
  <section>
    <OInputNumber v-model="val2" size="small" />
    <OInputNumber v-model="val2" />
    <OInputNumber v-model="val3" size="large" />
  </section>
  <h4>Shape</h4>
  <section>
    <OInputNumber v-model="val2" size="small" shape="round" />
    <OInputNumber v-model="val2" shape="round" />
    <OInputNumber v-model="val3" size="large" shape="round" />

    <OInputNumber v-model="val2" size="small" shape="round" controls="none" />
    <OInputNumber v-model="val2" shape="round" controls="none" />
    <OInputNumber v-model="val3" size="large" shape="round" controls="none" />
  </section>
  <h4>Disabled</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInputNumber v-model="val1" disabled />
    <OInputNumber v-model="val1" disabled style="width: 150px">
      <template #prefix>$</template>
    </OInputNumber>
    <OInputNumber v-model="val1" disabled style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
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
