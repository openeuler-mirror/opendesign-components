<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '../index';
const radioVal = ref('1');
</script>

<template>
  <section>
    <ORadio v-model="radioVal" value="1">
      <template #radio="{ checked }">
        {{ `自定义radio1 ${checked}` }}
      </template>
    </ORadio>
    <ORadio v-model="radioVal" value="2">
      <template #radio="{ checked }">
        {{ `自定义radio2 ${checked}` }}
      </template>
    </ORadio>
  </section>
</template>
