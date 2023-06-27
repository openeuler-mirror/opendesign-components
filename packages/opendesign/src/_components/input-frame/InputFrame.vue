<script setup lang="ts">
import { defaultSize } from '../../_utils/global';
import { inputFrameProps } from './types';
import { getRoundClass } from '../../_utils/style-class';

const props = defineProps(inputFrameProps);

const round = getRoundClass(props, 'if');
</script>
<template>
  <label
    class="o-if"
    :class="[
      `o-if-${props.color}`,
      `o-if-${props.variant}`,
      `o-if-${props.size || defaultSize}`,
      {
        'o-if-disabled': props.disabled,
        'o-if-readonly': props.readonly,
      },
      round.class.value,
    ]"
    :style="round.style.value"
    :for="props.for"
  >
    <div v-if="$slots.prepend" class="o-if-prepend">
      <slot name="prepend"></slot>
    </div>
    <div
      class="o-if-main"
      :class="{
        'is-disabled': props.disabled,
        'is-readonly': props.readonly,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
      }"
    >
      <slot></slot>
    </div>
    <div v-if="$slots.append" class="o-if-append">
      <slot name="append"></slot>
    </div>
  </label>
</template>
