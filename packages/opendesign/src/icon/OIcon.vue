<script setup lang="ts">
import { IconLoading } from '../_utils/icons';
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
    ]"
    :role="props.button ? 'button' : undefined"
    :aria-label="props.button ? props.ariaLabel : undefined"
    :aria-disabled="props.button && props.disabled ? 'true' : undefined"
    :tabindex="props.button ? 0 : ''"
  >
    <slot>
      <IconLoading v-if="props.loading" class="o-rotating" />
      <component :is="props.icon" v-else />
    </slot>
  </div>
</template>
