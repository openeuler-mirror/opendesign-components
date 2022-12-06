<script setup lang="ts">
import { defaultSize } from '../_shared/common';
import { ButtonSizeT, ButtonTypeT } from './button';

interface PropT {
  type?: ButtonTypeT;
  size?: ButtonSizeT;
}
const props = withDefaults(defineProps<PropT>(), {
  type: ButtonTypeT.OUTLINE,
  size: defaultSize.value,
});
</script>
<template>
  <button type="button" class="o-btn" :class="[`o-btn-${props.type}`, `o-btn-size-${props.size}`]">
    <slot></slot>
  </button>
</template>
