<docs lang="md">
<!-- zh-CN -->

### 自定义目标元素

调用 `useToast` 方法会返回关闭当前`toast` 的方法，可用于手动关闭。

<!-- en-US -->

### Custom target element

Calling the `useToast` method will return the method for closing the current `toast`, which can be used to manually close it.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OButton, useToast } from '@opensig/opendesign';

const wrapRef = ref();

const { show: showToast, close } = useToast(wrapRef);

const handleClick = () => {
  showToast({
    duration: 5000,
    position: 'center',
    targetAlign: 'left',
    targetOffset: 16,
    long: true,
    content: '在自定义目标元素内居中对齐',
  });
};
</script>
<template>
  <div ref="wrapRef" class="toast-wrap">
    <OButton @click="handleClick" color="primary" variant="solid">showToast</OButton>

    <OButton @click="close" color="primary" variant="solid">closeToast</OButton>
  </div>
</template>

<style lang="scss" scoped>
.toast-wrap {
  display: flex;
  margin-top: 12px;
  padding: 16px;
  width: 400px;
  height: 300px;
  background-color: var(--o-color-control5-light);
  border: 1px solid var(--o-color-control1);
  & > * {
    margin-right: 8px;
  }
}
</style>
