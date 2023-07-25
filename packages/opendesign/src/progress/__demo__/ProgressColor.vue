<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { OIconAdd, OIconMinus } from '../../icon-components';

const val = ref(60);
const increaseVal = () => {
  val.value += 10;
};

const decreaseVal = () => {
  val.value -= 10;
};
</script>

<template>
  <h4>自定义颜色</h4>
  <section>
    <div class="progress-btn">
      <OButton color="primary" size="small" @click="increaseVal">
        <OIconAdd />
      </OButton>
      <OButton color="primary" size="small" @click="decreaseVal">
        <OIconMinus />
      </OButton>
    </div>

    <OProgress :percentage="val" color="primary" :track-width="300" />
    <OProgress :percentage="val" color="success" :track-width="300" />
    <OProgress :percentage="val" color="warning" :track-width="300" />
    <OProgress :percentage="val" color="danger" :track-width="300" />
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
