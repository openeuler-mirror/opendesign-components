<script setup lang="ts">
import { computed } from 'vue';
import { badgeProps } from './types';

import { isNumber } from '../_utils/is';

const props = defineProps(badgeProps);

/**
 * @description 是否为数值计数场景（value 为 number 类型），用于决定是否添加 role=status / aria-live
 */
const isCountMode = computed(() => isNumber(props.value));

/**
 * @description dot 模式的无障碍标签，优先使用 ariaLabel prop，回退为 'new'
 */
const dotAriaLabel = computed(() => (props.dot ? props.ariaLabel || 'new' : undefined));

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
  const right = isNumber(x) ? `${x * -1}px` : `calc(${x} * -1)`;
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
    <sup
      class="o-badge-content"
      :style="style"
      :role="isCountMode ? 'status' : undefined"
      :aria-live="isCountMode ? 'polite' : undefined"
      :aria-label="dotAriaLabel"
    >
      <slot name="content">
        <div class="o-badge-label">{{ content }}</div>
      </slot>
    </sup>
  </div>
</template>
