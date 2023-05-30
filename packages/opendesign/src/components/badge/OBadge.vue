<script setup lang="ts">
import { computed } from 'vue';
import { badgeProps } from './types';

import { isNumber } from '../_shared/is';

const props = defineProps(badgeProps);

const content = computed(() => {
  if (props.dot) {
    return '';
  }
  if (isNumber(props.value) && isNumber(props.max)) {
    return props.value < props.max ? `${props.value}` : `${props.max}+`;
  }
  return props.value;
});

const style = computed(() => {
  const [x, y] = props.offset;
  const right = isNumber(x) ? `-${x}px` : `-${x}`;
  const top = isNumber(y) ? `${y}px` : `${y}`;
  return {
    right,
    top,
  };
});
</script>

<template>
  <div class="o-badge" :class="[`o-badge-${props.color}`, { 'o-badge-dot': props.dot, 'o-badge-only': !$slots.default }]">
    <slot></slot>
    <sup class="o-badge-content" :style="style">
      <slot name="content">
        <div class="o-badge-label">{{ content }}</div>
      </slot>
    </sup>
  </div>
</template>
