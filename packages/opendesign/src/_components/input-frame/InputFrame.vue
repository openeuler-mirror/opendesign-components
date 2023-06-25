<script setup lang="ts">
import { defaultSize } from '../../_utils/global';
import { datePickerProps } from './types';
import { getRoundClass } from '../../_utils/style-class';

const props = defineProps(datePickerProps);

const round = getRoundClass(props, 'textarea');
</script>
<template>
  <label
    class="o-input-frame"
    :class="[
      `o-input-frame-${props.color}`,
      `o-input-frame-${props.variant}`,
      `o-input-frame-size-${props.size || defaultSize}`,
      {
        'o-input-frame-disabled': props.disabled,
      },
      round.class.value,
    ]"
    :style="round.style.value"
    :for="props.for"
  >
    <div class="o-input-frame-wrap">
      <slot></slot>
    </div>
  </label>
</template>
