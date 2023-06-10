<script setup lang="ts">
import { OToggle, ORadioGroup, ORadio } from '@components/index';
import { ref } from 'vue';
const radioVal = ref(1);
</script>

<template>
  <h3>单选</h3>
  <section>
    <ORadioGroup v-model="radioVal" :style="{ '--radio-group-gap': '8px' }">
      <ORadio :value="1">
        <template #radio="{ checked }">
          <OToggle :checked="checked">筛选条件1</OToggle>
        </template>
      </ORadio>
      <ORadio :value="2">
        <template #radio="{ checked }">
          <OToggle :checked="checked">筛选条件2</OToggle>
        </template>
      </ORadio>
      <ORadio :value="3">
        <template #radio="{ checked }">
          <OToggle :checked="checked">筛选条件3</OToggle>
        </template>
      </ORadio>
      <ORadio :value="4">
        <template #radio="{ checked }">
          <OToggle :checked="checked">筛选条件4</OToggle>
        </template>
      </ORadio>
    </ORadioGroup>
  </section>
</template>
