<script setup lang="ts">
import { OButtonToggle, OCheckboxGroup, OCheckbox } from '@components/index';
import { ref } from 'vue';
const checkboxVal = ref([1]);
</script>

<template>
  <h3>单选</h3>
  <section>
    <OCheckboxGroup v-model="checkboxVal">
      <OCheckbox :value="1">
        <template #checkbox="{ checked }">
          <OButtonToggle :checked="checked">筛选条件1</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="2">
        <template #checkbox="{ checked }">
          <OButtonToggle :checked="checked">筛选条件2</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="3">
        <template #checkbox="{ checked }">
          <OButtonToggle :checked="checked">筛选条件3</OButtonToggle>
        </template>
      </OCheckbox>
      <OCheckbox :value="4">
        <template #checkbox="{ checked }">
          <OButtonToggle :checked="checked">筛选条件4</OButtonToggle>
        </template>
      </OCheckbox>
    </OCheckboxGroup>
  </section>
</template>
