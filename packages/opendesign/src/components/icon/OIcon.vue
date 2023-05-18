<script setup lang="ts">
import { iconProps } from './types';
const props = defineProps(iconProps);
</script>
<template>
  <div
    class="o-icon"
    :class="{
      'o-icon-btn': props.button,
      'o-icon-btn-disabled': props.disabled,
    }"
    tabindex="-1"
  >
    <slot>
      <component :is="props.icon" />
    </slot>
  </div>
</template>
