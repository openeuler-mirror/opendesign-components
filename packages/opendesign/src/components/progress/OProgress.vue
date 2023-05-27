<script setup lang="ts">
import { CSSProperties, computed } from 'vue';
import { progressProps } from './types';
import { isNumber, isUndefined } from '../_shared/is';

const DEFAULT_STROKE_WIDTH = {
  medium: 8,
  small: 4,
};
const props = defineProps(progressProps);

const strokeWidth = computed(() => props.strokeWidth ?? DEFAULT_STROKE_WIDTH[props.size]);

const lineBarStyle = computed(() => {
  return {
    width: `${props.percentage}%`,
    borderRadius: `${strokeWidth.value}px`,
  };
});

const lineTrackStyle = computed(() => {
  const rlt: CSSProperties = {
    height: `${strokeWidth.value}px`,
    borderRadius: `${strokeWidth.value}px`,
  };

  if (!isUndefined(props.trackWidth)) {
    rlt.width = isNumber(props.trackWidth) ? `${props.trackWidth}px` : props.trackWidth;
  }
  return rlt;
});

const label = computed(() => props.format(props.percentage));

const DEFAULT_CIRCLE_SIZE = {
  medium: 120,
  small: 60,
};

// 圆直径
const circleDiameter = computed(() => {
  if (isNumber(props.trackWidth)) {
    return props.trackWidth;
  }
  return DEFAULT_CIRCLE_SIZE[props.size];
});

// 圆中心
const circleCenter = computed(() => circleDiameter.value / 2);

// 圆半径
const circleRadius = computed(() => circleCenter.value - strokeWidth.value / 2);

// 圆进度
const circleStrokeDashArr = computed(() => {
  const perimeter = 2 * Math.PI * circleRadius.value;
  const percent = props.percentage / 100;
  return `${perimeter * percent}  ${perimeter * (1 - percent)}`;
});
</script>

<template>
  <div class="o-progress" :class="[`o-progress-${props.variant}`, `o-progress-${props.size}`, `o-progress-${props.color}`]">
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
      <div v-if="props.showLabel && !props.labelInside" class="o-progress-line-label" :class="{ 'is-icon': $slots.icon }">
        <slot name="icon" :percentage="props.percentage">
          <slot :percentage="props.percentage">
            {{ label }}
          </slot>
        </slot>
      </div>
    </div>
    <!-- variant === 'circle' -->
    <div v-if="props.variant === 'circle'" class="o-progress-circle-wrap">
      <svg :width="circleDiameter" :height="circleDiameter" :view-box="`0 0 ${circleDiameter} ${circleDiameter}`">
        <circle class="o-progress-circle-track" fill="none" :cx="circleCenter" :cy="circleCenter" :r="circleRadius" :stroke-width="strokeWidth" />
        <circle
          class="o-progress-circle-bar"
          fill="none"
          :cx="circleCenter"
          :cy="circleCenter"
          :r="circleRadius"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :transform="`matrix(0,-1,1,0,0,${circleDiameter})`"
          :stroke-dasharray="circleStrokeDashArr"
        />
      </svg>
      <div v-if="props.showLabel" class="o-progress-circle-label" :class="{ 'is-icon': $slots.icon }">
        <slot name="icon" :percentage="props.percentage">
          <slot :percentage="props.percentage">
            {{ label }}
          </slot>
        </slot>
      </div>
    </div>
  </div>
</template>
