<script lang="ts" setup>
import { computed } from 'vue';
import { isString } from '../_utils/is';
import { sliderMarksProps } from './types';

const props = defineProps(sliderMarksProps);
const label = computed(() => {
  return isString(props.mark) ? props.mark : props.mark!.label;
});
const style = computed(() => (isString(props.mark) ? undefined : props.mark!.style));
</script>

<template>
  <div class="o-slider-marks-text" :style="style">{{ label }}</div>
</template>
