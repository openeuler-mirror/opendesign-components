<docs lang="md">
<!-- zh-CN -->

### 阻止切换 & 异步切换

切换前组件会通过传入的 `beforeChange` 属性函数判断是否允许切换：

- 返回 `false` 或 `Promise<false>` 阻止切换
- 返回 `true` 或 `Promise<true>` 允许切换

**注**: 返回 `Promise<boolean>` 时需要通过 `loading` 属性手动控制加载状态的显示

<!-- en-US -->

### Prevent Switch & Asynchronous Switch

The component determines whether switching is allowed via the provided `beforeChange` prop function before switching:

- Return `false` or `Promise<false>` to prevent switching
- Return `true` or `Promise<true>` to allow switching

**Note**: When returning `Promise<boolean>`, the display of loading states must be manually controlled through the `loading` prop
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '@opensig/opendesign';

const isLoading = ref(false);
const asyncSwitch = (val: boolean) => {
  if (val) {
    return new Promise<boolean>((resolve) => {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
        resolve(true);
      }, 1000);
    });
  }
  return true;
};

const preventSwitching = () => {
  if (Math.random() > 0.5) return false;
  return true;
};
</script>

<template>
  <OSwitch :beforeChange="asyncSwitch" :loading="isLoading" />
  <OSwitch :beforeChange="preventSwitching" />
</template>

<style scoped lang="scss">
.o-switch + .o-switch {
  margin-left: 16px;
}
</style>
