<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { OIconDone } from '../../icon-components';

const val1 = ref('');
const val2 = ref('this is input value');
</script>
<template>
  <h4>Prefix & Suffix</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" />
    <OInput v-model="val2">
      <template #prefix>
        <OIconDone />
      </template>
    </OInput>
    <OInput v-model="val2">
      <template #suffix>
        <OIconDone />
      </template>
    </OInput>
    <OInput v-model="val2">
      <template #suffix>元 </template>
    </OInput>
  </section>

  <h4>Prepend & Append</h4>
  <section>
    <OInput v-model="val2">
      <template #prepend><span style="padding: 0 8px 0 7px">+86</span></template>
    </OInput>
    <OInput v-model="val2">
      <template #append><span style="padding: 0 7px 0 8px">RMB</span></template>
    </OInput>
  </section>
</template>
<style lang="scss"></style>
