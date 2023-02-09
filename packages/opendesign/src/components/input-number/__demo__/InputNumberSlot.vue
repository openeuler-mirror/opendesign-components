<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';

const val1 = ref('');
const val2 = ref(1000);
</script>
<template>
  <h4>Prefix & Suffix</h4>
  <section>
    <OInputNumber v-model:value="val1" style="width: 150px">
      <template #minus>Plus</template>
      <template #add>Minus</template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" style="width: 150px">
      <template #prefix> $ </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" :clearable="false" style="width: 150px">
      <template #suffix> 元 </template>
    </OInputNumber>
  </section>

  <h4>Prepend & Append</h4>
  <section>
    <OInputNumber v-model:value="val2">
      <template #prepend>+86</template>
    </OInputNumber>
    <OInputNumber v-model:value="val2">
      <template #append>RMB</template>
    </OInputNumber>
  </section>
</template>
<style lang="scss"></style>
