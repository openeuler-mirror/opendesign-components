<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref(0);
setTimeout(() => {
  val1.value = 3;
}, 2000);
const val2 = ref(100);
const val3 = ref(3333);
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
  </section>
  <h4>Size</h4>
  <div>val1:{{ val2 }}</div>
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
    <OInputNumber v-model="val2" disabled />
    <OInputNumber v-model="val2" disabled>
      <template #prefix>$</template>
    </OInputNumber>
    <OInputNumber v-model="val2" disabled style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
  </section>
</template>
<style lang="scss"></style>
