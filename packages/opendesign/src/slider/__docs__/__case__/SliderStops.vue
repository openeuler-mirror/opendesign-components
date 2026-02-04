<docs lang="md">
<!-- zh-CN -->

### 间隔滑动条

<!-- en-US -->

### Interval slider
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OSlider } from '@opensig/opendesign';

const sliderVal = ref(0);
</script>
<template>
  <OSlider v-model="sliderVal" show-input unit="M" show-stops :step="10" class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  width: 360px;

  @include respond('<=pad_v') {
    width: 100%;
  }
}
</style>
