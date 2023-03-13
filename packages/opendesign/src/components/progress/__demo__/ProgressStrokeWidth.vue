<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { IconAdd, IconMinus } from '../../icons';

const val = ref(60);
const increaseVal = () => {
  val.value += 10;
};

const decreaseVal = () => {
  val.value -= 10;
};
</script>

<template>
  <h4>自定义线宽</h4>
  <section>
    <div class="progress-btn">
      <OButton color="primary" @click="increaseVal">
        <IconAdd />
      </OButton>
      <OButton color="primary" @click="decreaseVal">
        <IconMinus />
      </OButton>
    </div>

    <OProgress :percentage="val" color="primary" :stroke-width="20" />
    <OProgress :percentage="val + 10" color="success" :stroke-width="20" />
    <OProgress :percentage="val + 15" color="warning" :stroke-width="20" />
    <OProgress :percentage="val + 20" color="danger" :stroke-width="20" />

    <div :style="{ display: 'flex', gap: '16px', flexWrap: 'wrap' }">
      <OProgress :percentage="val" color="primary" variant="circle" :width="200" :stroke-width="20" />
      <OProgress :percentage="val" color="success" variant="circle" :width="200" :stroke-width="20" />
      <OProgress :percentage="val" color="warning" variant="circle" :width="200" :stroke-width="20" />
      <OProgress :percentage="val" color="danger" variant="circle" :width="200" :stroke-width="20" />
    </div>
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
