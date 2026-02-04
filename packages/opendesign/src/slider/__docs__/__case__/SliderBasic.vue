<docs lang="md">
  <!-- zh-CN -->

### 连续滑动条

  <!-- en-US -->

### Continuous slider
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OSlider } from '@opensig/opendesign';

const sliderVal = ref(0);
</script>
<template>
  <OSlider v-model="sliderVal" show-input unit="kg" class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  width: 360px;

  @include respond('<=pad_v') {
    width: 100%;
  }
}
</style>
