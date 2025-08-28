<script setup lang="ts">
import { provide, useAttrs } from 'vue';
defineOptions({
  inheritAttrs: false,
});
provide('docs-config', useAttrs());
</script>
<template><slot></slot></template>
