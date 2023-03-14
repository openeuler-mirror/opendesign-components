<script setup lang="ts">
import { computed } from 'vue';
import { isNumber } from '../_shared/is';
import { progressProps } from './types';

const props = defineProps(progressProps);

const lineHeight = computed(() => (isNumber(props.strokeWidth) ? `${props.strokeWidth}px` : props.strokeWidth));

const lineBarStyle = computed(() => {
  return {
    width: `${props.percentage}%`,
    borderRadius: lineHeight.value,
  };
});

const lineTrackStyle = computed(() => {
  return {
    height: lineHeight.value,
    borderRadius: lineHeight.value,
  };
});

const label = computed(() => props.format(props.percentage));

const DEFAULT_CIRCLE_SIZE = 80;

// 圆直径
const circleDiameter = computed(() => props.width ?? DEFAULT_CIRCLE_SIZE);

// 圆中心
const circleCenter = computed(() => circleDiameter.value / 2);

// 圆半径
const circleRadius = computed(() => circleCenter.value - props.strokeWidth / 2);

// 圆进度
const circleStrokeDashArr = computed(() => {
  const perimeter = 2 * Math.PI * circleRadius.value;
  const percent = props.percentage / 100;
  return `${perimeter * percent}  ${perimeter * (1 - percent)}`;
});
</script>

<template>
  <div class="o-progress" :class="[`o-progress-${props.variant}`, `o-progress-${props.color}`]">
    <!-- variant === 'line' -->
    <div v-if="props.variant === 'line'" class="o-progress-line-wrap">
      <div class="o-progress-line-track" :style="lineTrackStyle">
        <div class="o-progress-line-bar" :style="lineBarStyle">
          <div v-if="props.showLabel && props.labelInside" class="o-progress-line-inner-label">
            <slot :percentage="props.percentage">
              {{ label }}
            </slot>
          </div>
        </div>
      </div>
      <div v-if="props.showLabel && !props.labelInside" class="o-progress-line-label">
        <slot :percentage="props.percentage">
          {{ label }}
        </slot>
      </div>
    </div>
    <!-- variant === circle -->
    <div v-if="props.variant === 'circle'" class="o-progress-circle-wrap">
      <svg :width="circleDiameter" :height="circleDiameter" :view-box="`0 0 ${circleDiameter} ${circleDiameter}`">
        <circle class="o-progress-circle-track" fill="none" :cx="circleCenter" :cy="circleCenter" :r="circleRadius" :stroke-width="props.strokeWidth" />
        <circle
          class="o-progress-circle-bar"
          fill="none"
          :cx="circleCenter"
          :cy="circleCenter"
          :r="circleRadius"
          :stroke-width="props.strokeWidth"
          stroke-linecap="round"
          :transform="`matrix(0,-1,1,0,0,${circleDiameter})`"
          :stroke-dasharray="circleStrokeDashArr"
        />
      </svg>
      <div v-if="props.showLabel" class="o-progress-circle-label">
        <slot :percentage="props.percentage">
          {{ label }}
        </slot>
      </div>
    </div>
  </div>
</template>
