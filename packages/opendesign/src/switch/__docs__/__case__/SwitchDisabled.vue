<docs lang="md">
<!-- zh-CN -->

### 禁用

通过 `disabled` 属性禁用组件。

<!-- en-US -->

### Disabled

Disable the component via the `disabled` prop.
</docs>
<script setup lang="ts">
import { OSwitch } from '@opensig/opendesign';
</script>
<template>
  <OSwitch disabled />
  <OSwitch default-checked disabled />
</template>
<style scoped lang="scss">
.o-switch + .o-switch {
  margin-left: 16px;
}
</style>
