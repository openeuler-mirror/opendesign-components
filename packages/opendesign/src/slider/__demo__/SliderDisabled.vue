<script setup lang="ts">
import { ref } from 'vue';
import { OSlider } from '../index';

const sliderVal = ref(0);
</script>
<template>
  <OSlider v-model="sliderVal" disabled class="slider-demo" />
  <OSlider v-model="sliderVal" show-stops :step="10" disabled class="slider-demo" />
</template>
<style scoped lang="scss">
.slider-demo {
  width: 360px;
}
</style>
