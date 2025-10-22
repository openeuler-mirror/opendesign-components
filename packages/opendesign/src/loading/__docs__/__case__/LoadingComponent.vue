<docs lang="md">
<!-- zh-CN -->

### 组件

通过 `OLoading` 组件创建一个加载动画。

通过 `wrapper` 属性设置加载动画的挂载容器，详见[OLayer.wrapper](/zh-CN/components/layer#使用)

<!-- en-US -->

### Component

Create a loading animation using the `OLoading` component.

Set the mount container for the loading animation via the `wrapper` property. For details, see [OLayer.wrapper](/en-US/components/layer#usage)
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OLoading, OButton } from '@opensig/opendesign';

const visible = ref(false);

const handleLoading = () => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
};
</script>
<template>
  <OButton @click="handleLoading">Click to load</OButton>
  <OLoading v-model:visible="visible" label="loading..." />
</template>
