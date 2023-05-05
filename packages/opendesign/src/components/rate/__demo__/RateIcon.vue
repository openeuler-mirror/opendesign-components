<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';
import { IconAdd } from '../../icon';
import { IconX } from '../../icon';

const rateVal1 = ref(4);
const rateVal2 = ref(0);
</script>

<template>
  <h4>自定义图标</h4>
  <section>
    <ORate v-model="rateVal1">
      <template #icon>
        <IconAdd />
      </template>
    </ORate>
    <ORate :default-value="rateVal2" allow-half>
      <template #icon>
        <IconX />
      </template>
    </ORate>
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
