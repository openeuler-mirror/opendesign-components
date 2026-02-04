<docs lang="md">
  <!-- zh-CN -->

### 禁用滑动条

  <!-- en-US -->

### Disabled slider
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OSlider } from '@opensig/opendesign';

const sliderVal = ref(0);
</script>
<template>
  <OSlider v-model="sliderVal" disabled class="slider-demo" />
  <OSlider v-model="sliderVal" show-stops :step="10" disabled class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  width: 360px;

  @include respond('<=pad_v') {
    width: 100%;
  }
}
</style>
