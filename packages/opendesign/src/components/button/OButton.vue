<script setup lang="ts">
import { defaultSize } from '../_shared/global';
import { buttonProps } from './types';
import { IconLoading } from '../_shared/icons';
import { getRoundClass } from '../_shared/style-class';

const props = defineProps(buttonProps);

const round = getRoundClass(props, 'btn');
</script>
<template>
  <button
    type="button"
    class="o-btn"
    :class="[
      `o-btn-${props.color}`,
      `o-btn-${props.size || defaultSize}`,
      `o-btn-${props.variant}`,
      round.class.value,
      {
        'o-btn-icon-only': $slots.icon && !$slots.default,
        'o-btn-disabled': props.disabled,
      },
    ]"
    :style="round.style.value"
  >
    <span v-if="$slots.icon || props.loading" class="o-btn-icon prefix" :class="{ loading: props.loading }">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else-if="$slots.icon" name="icon"></slot>
    </span>
    <slot></slot>
    <span v-if="$slots.iconSuffix" class="o-btn-icon suffix">
      <slot name="iconSuffix"></slot>
    </span>
  </button>
</template>
