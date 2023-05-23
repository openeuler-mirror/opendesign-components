<script setup lang="ts">
import { iconProps } from './types';
const props = defineProps(iconProps);
</script>
<template>
  <div
    class="o-icon"
    :class="[
      {
        'o-icon-btn': props.button,
        'o-icon-btn-disabled': props.disabled,
      },
      props.size ? `o-icon-${props.size}` : '',
    ]"
    :tabindex="props.button ? 0 : ''"
  >
    <slot>
      <component :is="props.icon" />
    </slot>
  </div>
</template>
