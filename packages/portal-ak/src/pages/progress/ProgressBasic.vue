<script setup lang="ts">
import { ref } from 'vue';
import { OProgress, OIconWarning, OIconDanger } from '@components/index';
const val1 = ref(0);
const val2 = ref(30);
const val3 = ref(100);
</script>

<template>
  <h3>M</h3>
  <section>
    <OProgress :percentage="val1" :track-width="300" />
    <OProgress :percentage="val2" :track-width="300" />
    <OProgress :percentage="val3" :track-width="300" />
    <OProgress :percentage="val2" color="warning" :track-width="300">
      <template #icon>
        <OIconWarning />
      </template>
    </OProgress>
    <OProgress :percentage="val2" color="danger" :track-width="300">
      <template #icon>
        <OIconDanger />
      </template>
    </OProgress>
  </section>

  <h3>S</h3>
  <section>
    <OProgress :percentage="val1" :track-width="300" size="small" />
    <OProgress :percentage="val2" :track-width="300" size="small" />
    <OProgress :percentage="val3" :track-width="300" size="small" />
    <OProgress :percentage="val2" color="warning" :track-width="300" size="small">
      <template #icon>
        <OIconWarning />
      </template>
    </OProgress>
    <OProgress :percentage="val2" color="danger" :track-width="300" size="small">
      <template #icon>
        <OIconDanger />
      </template>
    </OProgress>
  </section>
</template>

<style lang="scss" scoped></style>
