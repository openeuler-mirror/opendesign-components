<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';
import { OIconDone, OIconClose } from '../../icon-components';

const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
const switchVal4 = ref(true);
</script>

<template>
  <h4>插槽</h4>
  <section>
    <OSwitch v-model="switchVal1">
      <template #on>开</template>
      <template #off>关</template>
    </OSwitch>

    <OSwitch v-model="switchVal2">
      <template #on><OIconDone /></template>
      <template #off><OIconClose /></template>
    </OSwitch>

    <OSwitch v-model="switchVal3" round="pill">
      <template #on>开</template>
      <template #off>关</template>
    </OSwitch>

    <OSwitch v-model="switchVal4" round="pill">
      <template #on><OIconDone /></template>
      <template #off><OIconClose /></template>
    </OSwitch>
  </section>
</template>
