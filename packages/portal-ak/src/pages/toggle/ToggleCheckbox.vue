<script setup lang="ts">
import { OToggle, OCheckboxGroup, OCheckbox } from '@components/index';
import { ref } from 'vue';
const checkboxVal = ref([1]);
</script>

<template>
  <h3>多选</h3>
  <section>
    <OCheckboxGroup v-model="checkboxVal" :style="{ '--checkbox-group-gap': '8px' }">
      <OCheckbox :value="1">
        <template #checkbox="{ checked }">
          <OToggle :checked="checked">筛选条件1</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="2">
        <template #checkbox="{ checked }">
          <OToggle :checked="checked">筛选条件2</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="3">
        <template #checkbox="{ checked }">
          <OToggle :checked="checked">筛选条件3</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="4">
        <template #checkbox="{ checked }">
          <OToggle :checked="checked">筛选条件4</OToggle>
        </template>
      </OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
