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
  <h4>环形进度条</h4>
  <section class="progress-container">
    <div class="progress-btn">
      <OButton color="primary" size="small" @click="increaseVal">
        <OIconAdd />
      </OButton>
      <OButton color="primary" size="small" @click="decreaseVal">
        <OIconMinus />
      </OButton>
    </div>

    <div :style="{ display: 'flex', gap: '16px', flexWrap: 'wrap' }">
      <OProgress :percentage="val" color="primary" variant="circle" :width="120" />
      <OProgress :percentage="val" color="success" variant="circle" :width="120" />
      <OProgress :percentage="val" color="warning" variant="circle" :width="120" />
      <OProgress :percentage="val" color="danger" variant="circle" :width="120" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.progress-container {
  flex-direction: column;
  align-items: flex-start;
}

.progress-btn {
  .o-btn + .o-btn {
    margin-left: 8px;
  }
}

.o-progress + .o-progress {
  margin-left: 20px;
}
</style>
