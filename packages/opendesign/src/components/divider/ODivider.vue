<script setup lang="ts">
import { dividerProps } from './types';

const props = defineProps(dividerProps);
</script>

<template>
  <div
    role="separator"
    class="o-divider"
    :class="[`o-divider-${props.type}`, `o-divider-direction-${props.direction}`, { [`o-divider-content-${props.contentPosition}`]: $slots.default }]"
  >
    <template v-if="props.direction === 'horizontal'">
      <div class="o-divider-line"></div>
      <template v-if="$slots.default">
        <div class="o-divider-content">
          <slot></slot>
        </div>
        <div class="o-divider-line"></div>
      </template>
    </template>
  </div>
</template>
