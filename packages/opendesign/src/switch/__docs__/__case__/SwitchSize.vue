<docs lang="md">
<!-- zh-CN -->

### 不同尺寸

`OSwitch` 支持 `medium` 和 `small` 两种尺寸，通过 `size` 属性设置。

<!-- en-US -->

### Different sizes

`OSwitch` supports two sizes, `medium` and `small`, which can be set through the `size` property.
</docs>
<script setup lang="ts">
import { OSwitch } from '@opensig/opendesign';
</script>

<template>
  <OSwitch size="small" />
  <OSwitch size="medium" />
  <OSwitch />
</template>

<style scoped lang="scss">
.o-switch + .o-switch {
  margin-left: 16px;
}
</style>
