<script setup lang="ts">
import { flexItemProps } from './types';

const props = defineProps(flexItemProps);
</script>
<template>
  <div
    class="o-flex-item"
    :style="{
      alignSelf: props.align,
      '--flex-item-flex': props.flex,
      '--flex-item-xs-flex': props.xs?.flex,
      '--flex-item-sm-flex': props.sm?.flex,
      '--flex-item-md-flex': props.md?.flex,
      '--flex-item-lg-flex': props.lg?.flex,
      '--flex-item-xl-flex': props.xl?.flex,
    }"
    :class="{
      'o-flex-item-xs': !!props.xs,
      'o-flex-item-sm': !!props.sm,
      'o-flex-item-md': !!props.md,
      'o-flex-item-lg': !!props.lg,
      'o-flex-item-xl': !!props.xl,
    }"
  >
    <slot></slot>
  </div>
</template>
