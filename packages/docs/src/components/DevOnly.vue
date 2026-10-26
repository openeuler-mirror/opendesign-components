<script setup lang="ts">
/**
 * @description 仅在文档站开发模式（pnpm docs:dev）下渲染插槽内容的包装组件，生产构建中不渲染任何内容
 */
/* global __DEV__ */
const isDev = __DEV__;
</script>

<template>
  <slot v-if="isDev" />
</template>
