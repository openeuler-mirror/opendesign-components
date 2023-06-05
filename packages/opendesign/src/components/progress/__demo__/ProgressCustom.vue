<script setup lang="ts">
import { ref } from 'vue';

import { OProgress } from '../index';

import '../../button/style';
import { OButton } from '../../button';
import { OIconAdd, OIconMinus } from '../../icon-components';
import { OIconWarning } from '../../icon-components';

const val = ref(10);

const increaseVal = () => {
  val.value += 10;
};

const decreaseVal = () => {
  val.value -= 10;
};

const format = (percentage: number) => {
  return `进度${percentage}%`;
};
</script>

<template>
  <h4>自定义文字</h4>

  <section class="progress-container">
    <div class="progress-btn">
      <OButton color="primary" size="small" @click="increaseVal">
        <OIconAdd />
      </OButton>
      <OButton color="primary" size="small" @click="decreaseVal">
        <OIconMinus />
      </OButton>
    </div>

    <section>
      <div>
        <p>Format</p>
        <section>
          <OProgress :percentage="val" :format="format" :style="{ width: '400px' }" />
        </section>
      </div>
      <div>
        <p>插槽</p>
        <section>
          <OProgress :percentage="val" :style="{ width: '400px' }">
            <template #default="{ percentage }">
              {{ `content ${percentage}` }}
            </template>
          </OProgress>
        </section>
      </div>
      <div>
        <p>图标</p>
        <section>
          <OProgress :percentage="val" color="warning" :style="{ width: '400px' }">
            <template #icon>
              <OIconWarning />
            </template>
          </OProgress>
        </section>
      </div>
    </section>
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
</style>
