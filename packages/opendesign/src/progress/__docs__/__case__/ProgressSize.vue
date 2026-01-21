<docs lang="md">
<!-- zh-CN -->

#### 尺寸

<!-- en-US -->

#### Size
</docs>
<script setup lang="ts">
import { OProgress } from '@opensig/opendesign';

const trackWidth = 300;
const percentage = 30;
</script>
<template>
  <div class="demo-progress-size-wrap">
    <div class="demo-progress-size">
      <div class="size-label">M</div>
      <OProgress size="medium" :track-width="trackWidth" />
      <OProgress size="medium" :track-width="trackWidth" :percentage="percentage" />
    </div>
    <div class="demo-progress-size">
      <div class="size-label">S</div>
      <OProgress size="small" :track-width="trackWidth" />
      <OProgress size="small" :track-width="trackWidth" :percentage="percentage" />
    </div>
  </div>
</template>
<style lang="scss">
@use '../../../_styles/mixin.scss';
.demo-progress-size-wrap {
  .demo-progress-size {
    display: flex;
    flex-direction: column;
    align-items: start;
    &:first-child {
      margin-bottom: 16px;
    }
  }
  .size-label {
    width: 80px;
    margin-right: 24px;
  }
}
</style>
