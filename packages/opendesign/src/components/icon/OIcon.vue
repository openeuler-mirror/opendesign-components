<script setup lang="ts">
import { IconLoading } from '../_shared/icons';
import { iconProps } from './types';
import { defaultSize } from '../_shared/global';
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
      `o-icon-${props.size || defaultSize}`,
    ]"
    :tabindex="props.button ? 0 : ''"
  >
    <slot>
      <IconLoading v-if="props.loading" class="o-rotating" />
      <component :is="props.icon" v-else />
    </slot>
  </div>
</template>
