<script setup lang="ts">
import { computed } from 'vue';
import { badgeProps } from './types';

import { isNumber } from '../_utils/is';

const props = defineProps(badgeProps);

/**
 * @description 数值计数且非 dot 模式时徽标有可见文本，挂 role=status 作为 live region
 * （role=status 隐含 aria-live=polite，显式声明便于阅读）；dot 无文本，不作为播报源
 */
const hasCountText = computed(() => isNumber(props.value) && !props.dot);

/**
 * @description 无障碍标签：ariaLabel prop 优先透传（各模式均生效），dot 模式缺省回退 'new'
 */
const badgeAriaLabel = computed(() => props.ariaLabel || (props.dot ? 'new' : undefined));

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
      :role="hasCountText ? 'status' : undefined"
      :aria-live="hasCountText ? 'polite' : undefined"
      :aria-label="badgeAriaLabel"
    >
      <slot name="content">
        <div class="o-badge-label">{{ content }}</div>
      </slot>
    </sup>
  </div>
</template>
