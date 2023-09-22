<script setup lang="ts">
import { ref } from 'vue';
import { OToggle } from '../index';
import '../../checkbox/style';
import { OCheckbox } from '../../checkbox';
import '../../checkbox-group/style';
import { OCheckboxGroup } from '../../checkbox-group';
import { OIconAdd } from '../../icon-components';

const checkboxVal = ref([1, 2]);
</script>

<template>
  <h3>最少选择1个，最多选择3个</h3>
  <section>
    <OCheckboxGroup v-model="checkboxVal" :min="1" :max="3" :style="{ '--checkbox-group-gap': '8px' }">
      <OCheckbox :value="1">
        <template #checkbox="{ checked, disabled }">
          <OToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件1</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="2">
        <template #checkbox="{ checked, disabled }">
          <OToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件2</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="3">
        <template #checkbox="{ checked, disabled }">
          <OToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件3</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="4">
        <template #checkbox="{ checked, disabled }">
          <OToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件4</OToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="5">
        <template #checkbox="{ checked, disabled }">
          <OToggle :checked="checked" :disabled="disabled" :icon="OIconAdd">筛选条件5</OToggle>
        </template>
      </OCheckbox>
    </OCheckboxGroup>
  </section>
</template>

<style lang="scss" scoped></style>
