<docs lang="md">
<!-- zh-CN -->

### 组件圆角

可通过 `round` 属性设置组件的圆角。取值有 `pill`（半圆）或其他 `border-radius` 可接受的值。

<!-- en-US -->

### Component Border Radius

Set the component's border radius via the `round` prop. Accepts values such as `pill` (semi-circle) or other valid `border-radius` values.
</docs>
<script setup lang="ts">
import { OSwitch } from '@opensig/opendesign';
</script>

<template>
  <OSwitch round="pill" />
  <OSwitch round="4px" />
  <OSwitch round="8px" />
</template>

<style scoped lang="scss">
.o-switch + .o-switch {
  margin-left: 16px;
}
</style>
