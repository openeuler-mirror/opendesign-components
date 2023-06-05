<script setup lang="ts">
import { OButtonToggle, ORadioGroup, ORadio } from '@components/index';
import { ref } from 'vue';
const radioVal = ref(1);
</script>

<template>
  <h3>单选</h3>
  <section>
    <ORadioGroup v-model="radioVal">
      <ORadio :value="1">
        <template #radio="{ checked }">
          <OButtonToggle :checked="checked">筛选条件1</OButtonToggle>
        </template>
      </ORadio>
      <ORadio :value="2">
        <template #radio="{ checked }">
          <OButtonToggle :checked="checked">筛选条件2</OButtonToggle>
        </template>
      </ORadio>
      <ORadio :value="3">
        <template #radio="{ checked }">
          <OButtonToggle :checked="checked">筛选条件3</OButtonToggle>
        </template>
      </ORadio>
      <ORadio :value="4">
        <template #radio="{ checked }">
          <OButtonToggle :checked="checked">筛选条件4</OButtonToggle>
        </template>
      </ORadio>
    </ORadioGroup>
  </section>
</template>
