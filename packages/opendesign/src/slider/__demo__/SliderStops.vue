<script setup lang="ts">
import { ref } from 'vue';
import { OSlider } from '../index';

const sliderVal = ref(0);
</script>
<template>
  <OSlider v-model="sliderVal" show-input unit="M" show-stops :step="10" class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  width: 360px;
}
</style>
