<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox } from '../index';
const checkboxVal = ref(['1']);
</script>

<template>
  <section>
    <OCheckbox v-model="checkboxVal" value="1">
      <template #checkbox="{ checked }">
        {{ `自定义checkbox1 ${checked}` }}
      </template>
    </OCheckbox>
    <OCheckbox v-model="checkboxVal" value="2">
      <template #checkbox="{ checked }">
        {{ `自定义checkbox2 ${checked}` }}
      </template>
    </OCheckbox>
  </section>
</template>
