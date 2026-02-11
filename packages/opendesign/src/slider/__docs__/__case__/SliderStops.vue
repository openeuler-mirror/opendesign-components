<docs lang="md">
<!-- zh-CN -->

### 间隔滑动条

<!-- en-US -->

### Interval slider
</docs>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { OSlider } from '@opensig/opendesign';

const BOUNDARY = 840;
const sliderVal = ref(0);

const viewportWidth = ref(window.innerWidth);

const updateWidth = () => {
  viewportWidth.value = window.innerWidth;
};

const lePadV = computed(() => {
  return viewportWidth.value <= BOUNDARY;
});

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const marks = Array(11)
  .fill(0)
  .reduce((acc, _curr, idx) => {
    acc[idx] = idx + '';
    return acc;
  }, {});
</script>
<template>
  <OSlider v-model="sliderVal" :marks="lePadV ? marks : undefined" show-input unit="M" :show-popover="!lePadV" show-stops :max="10" class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  --slider-marks-gap: 0;
  margin-top: 16px;
  width: 360px;

  :deep(.o-slider-marks-text) {
    top: -30px;
  }
  @include respond('<=pad_v') {
    width: 100%;
  }
}
</style>
