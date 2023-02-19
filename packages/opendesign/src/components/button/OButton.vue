<script setup lang="ts">
import { defaultSize, defaultRound } from '../_shared/global';
import { buttonProps } from './types';
import { IconLoading } from '../_shared/icons';
import { computed, StyleValue } from 'vue';

const props = defineProps(buttonProps);

const styleList = computed(() => {
  const rlt: StyleValue = {};

  const round = props.round || defaultRound.value;

  if (round) {
    if (round !== 'pill') {
      rlt['--btn-radius'] = props.round;
    }
  }
  return rlt;
});

const classList = computed(() => {
  const rlt = [];

  if (props.color) {
    rlt.push(`o-btn-${props.color}`);
  }

  rlt.push(`o-btn-${props.size || defaultSize.value}`);

  rlt.push(`o-btn-${props.variant}`);

  if (props.round) {
    if (props.round === 'pill') {
      rlt.push('o-btn-round-pill');
    } else {
      rlt.push('o-btn-round-diy');
    }
  } else {
    if (defaultRound.value) {
      rlt.push('o-btn-round-diy');
    }
  }
  return rlt;
});
</script>
<template>
  <button
    type="button"
    class="o-btn"
    :class="[
      ...classList,
      {
        'o-btn-icon-only': $slots.icon && !$slots.default,
        'o-btn-disabled': props.disabled,
      },
    ]"
    :style="styleList"
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
