<script setup lang="ts">
import { defaultSize } from '../../_utils/global';
import { inBoxProps } from './types';
import { getRoundClass } from '../../_utils/style-class';

const props = defineProps(inBoxProps);

const round = getRoundClass(props, '_box');
</script>
<template>
  <label
    class="o_box"
    :class="[
      `o_box-${props.color}`,
      `o_box-${props.variant}`,
      `o_box-${props.size || defaultSize}`,
      {
        'o_box-disabled': props.disabled,
        'o_box-readonly': props.readonly,
        'o_box-focused': props.focused,
        'o_box-input': props.input,
      },
      round.class.value,
    ]"
    :style="round.style.value"
    :for="props.for"
  >
    <div v-if="$slots.prepend" class="o_box-prepend" @mousedown.prevent>
      <slot name="prepend"></slot>
    </div>

    <slot></slot>

    <div v-if="$slots.append" class="o_box-append" @mousedown.prevent>
      <slot name="append"></slot>
    </div>
  </label>
</template>
