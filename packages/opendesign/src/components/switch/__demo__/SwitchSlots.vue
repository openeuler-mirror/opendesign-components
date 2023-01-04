<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
import { IconDone, IconX } from '../../icons';

const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <section>
    <OSWitch v-model="switchVal1" shape="normal">
      <template #on>开</template>
      <template #off>关</template>
    </OSWitch>

    <OSWitch v-model="switchVal1" shape="normal">
      <template #on><IconDone /></template>
      <template #off><IconX /></template>
    </OSWitch>

    <OSWitch v-model="switchVal2" shape="round">
      <template #on>开</template>
      <template #off>关</template>
    </OSWitch>

    <OSWitch v-model="switchVal2" shape="round">
      <template #on><IconDone /></template>
      <template #off><IconX /></template>
    </OSWitch>
  </section>
</template>
