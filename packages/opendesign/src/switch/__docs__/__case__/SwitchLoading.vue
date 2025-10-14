<docs lang="md">
<!-- zh-CN -->

### 加载状态

通过 `loading` 属性设置组件的加载状态。处于加载状态时，组件将显示加载动画，同时组件将自动被禁用。

<!-- en-US -->

### Loading State

Set the component's loading state via the `loading` prop.
When in the loading state, the component will display a loading indicator and will be automatically disabled.
</docs>
<script setup lang="ts">
import { OSwitch } from '@opensig/opendesign';
</script>

<template>
  <OSwitch loading />
  <OSwitch loading default-checked />
  <OSwitch loading disabled :model-value="false" />
</template>

<style scoped lang="scss">
.o-switch + .o-switch {
  margin-left: 16px;
}
</style>
