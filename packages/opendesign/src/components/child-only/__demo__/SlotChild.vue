<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { OChildOnly } from '../index';
const child = ref();
onMounted(() => {
  // console.log(child.value.$el);
  console.log(child.value.$el);
});
</script>
<template>
  <OChildOnly ref="child">
    <slot name="head"></slot>
    <slot></slot>
  </OChildOnly>
</template>
