<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { OIconAdd, OIconMinus } from '../../icon-components';

const val = ref(10);
const increaseVal = () => {
  val.value += 10;
};

const decreaseVal = () => {
  val.value -= 10;
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <div class="progress-btn">
      <OButton color="primary" size="small" @click="increaseVal">
        <OIconAdd />
      </OButton>
      <OButton color="primary" size="small" @click="decreaseVal">
        <OIconMinus />
      </OButton>
    </div>
    <OProgress :percentage="val" :track-width="200" />
    <OProgress :percentage="val" :track-width="200" :show-label="false" />

    <OProgress :percentage="val" :track-width="200" size="small" />
    <OProgress :percentage="val" :track-width="200" :show-label="false" size="small" />
  </section>
</template>

<style lang="scss" scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}

.progress-btn {
  .o-btn + .o-btn {
    margin-left: 8px;
  }
}
</style>
