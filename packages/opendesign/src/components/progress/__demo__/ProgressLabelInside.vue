<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { OIconAdd, OIconMinus } from '../../icon-components';

const val = ref(30);
const increaseVal = () => {
  val.value += 10;
};

const decreaseVal = () => {
  val.value -= 10;
};
</script>

<template>
  <h4>文字在进度条内部</h4>
  <section>
    <div class="progress-btn">
      <OButton color="primary" @click="increaseVal">
        <OIconAdd />
      </OButton>
      <OButton color="primary" @click="decreaseVal">
        <OIconMinus />
      </OButton>
    </div>

    <OProgress :percentage="val" color="primary" :style="{ width: '300px' }" :stroke-width="24" label-inside />
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
