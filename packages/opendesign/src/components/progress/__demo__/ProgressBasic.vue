<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { IconAdd, IconMinus } from '../../icon';

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
        <IconAdd />
      </OButton>
      <OButton color="primary" size="small" @click="decreaseVal">
        <IconMinus />
      </OButton>
    </div>
    <OProgress :percentage="val" :width="200" :style="{ width: '300px' }" />
    <OProgress :percentage="val" :width="200" :style="{ width: '300px' }" :show-label="false" />
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
