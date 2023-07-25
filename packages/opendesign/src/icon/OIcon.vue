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
    :tabindex="props.button ? 0 : ''"
  >
    <slot>
      <IconLoading v-if="props.loading" class="o-rotating" />
      <component :is="props.icon" v-else />
    </slot>
  </div>
</template>
