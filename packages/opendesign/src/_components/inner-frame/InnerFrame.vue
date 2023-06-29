<script setup lang="ts">
import { defaultSize } from '../../_utils/global';
import { innerFrameProps } from './types';
import { getRoundClass } from '../../_utils/style-class';

const props = defineProps(innerFrameProps);

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
        'o-if-focused': props.focused,
      },
      round.class.value,
    ]"
    :style="round.style.value"
    :for="props.for"
  >
    <div v-if="$slots.prepend" class="o-if-prepend" @mousedown.prevent>
      <slot name="prepend"></slot>
    </div>
    <div
      class="o-if-main"
      :class="{
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
      }"
    >
      <div v-if="$slots.prefix" class="o-if-prefix" @mousedown.prevent>
        <slot name="prefix"></slot>
      </div>
      <slot></slot>

      <div v-if="$slots.suffix" class="o-if-suffix" @mousedown.prevent>
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="$slots.append" class="o-if-append" @mousedown.prevent>
      <slot name="append"></slot>
    </div>
  </label>
</template>
