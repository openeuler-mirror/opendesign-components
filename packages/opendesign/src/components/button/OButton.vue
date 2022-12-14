<script setup lang="ts">
import { defaultSize, defaultShape } from '../_shared/common';
import { ButtonSizeT, ButtonTypeT, ButtonShapeT } from './button';

interface PropT {
  type?: ButtonTypeT;
  size?: ButtonSizeT;
  shape?: ButtonShapeT;
}
const props = withDefaults(defineProps<PropT>(), {
  type: ButtonTypeT.OUTLINE,
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
