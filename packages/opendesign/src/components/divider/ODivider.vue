<script setup lang="ts">
import { dividerProps } from './types';

const props = defineProps(dividerProps);
</script>

<template>
  <div
    role="separator"
    class="o-divider"
    :class="[`o-divider-${props.variant}`, `o-divider-${props.direction}`, { [`o-divider-label-${props.labelPosition}`]: $slots.default }]"
  >
    <template v-if="props.direction === 'h'">
      <div class="o-divider-line"></div>
      <template v-if="$slots.default">
        <div class="o-divider-label">
          <slot></slot>
        </div>
        <div class="o-divider-line"></div>
      </template>
    </template>
  </div>
</template>
