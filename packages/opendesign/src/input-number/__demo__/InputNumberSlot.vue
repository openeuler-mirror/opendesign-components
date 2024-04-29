<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref('');
const val2 = ref(1000);
</script>
<template>
  <h4>add & minus</h4>
  <section>
    <OInputNumber v-model:value="val1" style="width: 150px">
      <template #minus>Minus</template>
      <template #plus>Plus</template>
    </OInputNumber>
    <OInputNumber v-model:value="val1" controls="left" style="width: 150px">
      <template #minus><span>-</span></template>
      <template #plus><span>+</span></template>
    </OInputNumber>
    <OInputNumber v-model:value="val1" controls="right" style="width: 150px">
      <template #minus><span>-</span></template>
      <template #plus><span>+</span></template>
    </OInputNumber>
  </section>
  <h4>Prefix & Suffix</h4>
  <section>
    <OInputNumber v-model:value="val2" style="width: 150px">
      <template #prefix> $ </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" :clearable="false" style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
  </section>
</template>
<style lang="scss"></style>
