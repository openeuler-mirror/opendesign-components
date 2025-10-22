<docs lang="md">
<!-- zh-CN -->

### 服务

可通过 `useLoading` 创建一个 Loading 服务

<!-- en-US -->

### Service

Create a Loading service via `useLoading`
</docs>
<script setup lang="ts">
import { useLoading, OButton } from '@opensig/opendesign';
import { ref } from 'vue';

const container = ref<HTMLElement>();
const loadingService = useLoading({ label: 'Service loading...' }, container);
const handleClick = () => {
  loadingService.toggle(true);
  setTimeout(() => {
    loadingService.toggle(false);
  }, 3000);
};
</script>
<template>
  <OButton @click="handleClick">Open loading</OButton>
  <div ref="container" class="container"></div>
</template>
<style scoped lang="scss">
.container {
  height: 100px;
  max-width: 200px;
  margin-top: 12px;
  background-color: pink;
  position: relative;
}
</style>
