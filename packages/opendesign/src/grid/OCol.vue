<script setup lang="ts">
import { colProps } from './types';

const props = defineProps(colProps);
</script>
<template>
  <div
    class="o-col"
    :style="{
      alignSelf: props.align,
      '--col-flex': props.flex,
      '--col-phone-flex': props.phone?.flex,
      '--col-pad-v-flex': props.padV?.flex,
      '--col-pad-flex': props.pad?.flex,
      '--col-laptop-flex': props.laptop?.flex,
    }"
    :class="{
      'o-col-phone': !!props.phone,
      'o-col-pad-v': !!props.padV,
      'o-col-pad': !!props.pad,
      'o-col-laptop': !!props.laptop,
    }"
  >
    <slot></slot>
  </div>
</template>
