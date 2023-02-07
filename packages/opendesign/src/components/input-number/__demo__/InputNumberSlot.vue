<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '../index';
import { IconDone } from '../../icons';

const val1 = ref('');
const val2 = ref('this is input value');
</script>
<template>
  <h4>Prefix & Suffix</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInputNumber v-model:value="val2" />
    <OInputNumber v-model:value="val2">
      <template #prefix>
        <IconDone />
      </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2">
      <template #suffix>
        <IconDone />
      </template>
    </OInputNumber>
    <OInputNumber v-model:value="val2" :clearable="false">
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
