<script setup lang="ts">
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { ButtonTypeT } from './types';

interface ButtonPropT {
  type?: ButtonTypeT;
  size?: SizeT;
  shape?: ShapeT;
}
const props = withDefaults(defineProps<ButtonPropT>(), {
  type: 'outline',
  size: defaultSize.value,
  shape: defaultShape.value,
});
</script>
<template>
  <button
    type="button"
    class="o-btn"
    :class="[
      `o-btn-${props.type}`,
      `o-btn-size-${props.size}`,
      `o-btn-shape-${props.shape}`,
      {
        'o-btn-icon-only': $slots.icon && !$slots.default,
      },
    ]"
  >
    <span v-if="$slots.icon" class="o-btn-icon">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>
