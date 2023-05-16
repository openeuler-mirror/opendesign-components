<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';
import { OIconAdd } from '../../icon-svgs';
import { OIconX } from '../../icon-svgs';

const rateVal1 = ref(4);
const rateVal2 = ref(0);
</script>

<template>
  <h4>自定义图标</h4>
  <section>
    <ORate v-model="rateVal1">
      <template #icon>
        <OIconAdd />
      </template>
    </ORate>
    <ORate :default-value="rateVal2" allow-half>
      <template #icon>
        <OIconX />
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
