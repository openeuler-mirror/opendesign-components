<script setup lang="ts">
import { defaultSize } from '../../_utils/global';
import { inBoxProps } from './types';
import { getRoundClass } from '../../_utils/style-class';

defineSlots<{
  default(): any;
  prepend(): any;
  append(): any;
}>();

const props = defineProps(inBoxProps);

const round = getRoundClass(props, '_box');
</script>
<template>
  <div
    class="o_box"
    :class="[`o_box-${props.color}`, `o_box-${props.variant}`, `o_box-${props.size || defaultSize}`, round.class.value]"
    :style="round.style.value"
  >
    <div v-if="$slots.prepend?.()" class="o_box-prepend">
      <slot name="prepend"></slot>
    </div>
    <div
      class="o_box-main"
      :class="[
        {
          'o_box-disabled': props.disabled,
          'o_box-readonly': props.readonly,
          'o_box-focused': props.focused,
          'has-prepend': $slots.prepend,
          'has-append': $slots.append,
        },
        round.class.value,
      ]"
    >
      <slot></slot>
    </div>
    <div v-if="$slots.append?.()" class="o_box-append">
      <slot name="append"></slot>
    </div>
  </div>
</template>
