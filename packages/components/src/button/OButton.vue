<script setup lang="ts">
import { SizeT, ButtonTypeT } from './button';

interface PropT {
  type?: ButtonTypeT,
  size?:  SizeT
}
const props = withDefaults(defineProps<PropT>(), {
  type: ButtonTypeT.OUTLINE,
  size: SizeT.NORMAL,
});

</script>
<template>
  <div
    class="o-button"
    :class="[`o-button-${props.type}`, `o-button-size-${props.size}`]">
    <slot></slot>
  </div>
</template>