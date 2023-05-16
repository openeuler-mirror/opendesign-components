<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
import { OIconDone, OIconX } from '../../icon-svgs';

const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <h4>插槽</h4>
  <section>
    <OSWitch v-model="switchVal1">
      <template #on>开</template>
      <template #off>关</template>
    </OSWitch>

    <OSWitch v-model="switchVal1">
      <template #on><OIconDone /></template>
      <template #off><OIconX /></template>
    </OSWitch>

    <OSWitch v-model="switchVal2" round="pill">
      <template #on>开</template>
      <template #off>关</template>
    </OSWitch>

    <OSWitch v-model="switchVal2" round="pill">
      <template #on><OIconDone /></template>
      <template #off><OIconX /></template>
    </OSWitch>
  </section>
</template>
