<script setup lang="ts">
import { OButtonToggle, OCheckboxGroup, OCheckbox, OIconAdd } from '@components/index';

import { ref } from 'vue';
const checkboxVal = ref([1, 2]);
</script>

<template>
  <h3>最少选择1个，最多选择3个</h3>
  <section>
    <OCheckboxGroup v-model="checkboxVal" :min="1" :max="3">
      <OCheckbox :value="1">
        <template #checkbox="{ checked, disabled }">
          <OButtonToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件1</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="2">
        <template #checkbox="{ checked, disabled }">
          <OButtonToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件2</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="3">
        <template #checkbox="{ checked, disabled }">
          <OButtonToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件3</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="4">
        <template #checkbox="{ checked, disabled }">
          <OButtonToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件4</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="5">
        <template #checkbox="{ checked, disabled }">
          <OButtonToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件5</OButtonToggle>
        </template>
      </OCheckbox>
    </OCheckboxGroup>
  </section>
</template>

<style lang="scss" scoped></style>
