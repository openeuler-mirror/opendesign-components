<script setup lang="ts">
import { computed } from 'vue';
import { isNumber } from '../_shared/is';
import { badgeProps } from './types';

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
      <slot v-if="$slots.content" name="content"></slot>
      <template v-else>{{ content }}</template>
    </sup>
  </div>
</template>
