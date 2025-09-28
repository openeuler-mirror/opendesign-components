<docs lang="md">
<!-- zh-CN -->

### 自定义加载动画

#### icon 属性

通过 `icon` 属性传入自定义图标。注意：自定义的图标默认没有旋转动画，除非设置 `iconRotating` 属性为 `true`

<!-- en-US -->

### Custom Loading Animation

#### icon Parameter

Pass a custom icon through the `icon` property.
Note: The custom icon does not have a rotating animation by default unless the `iconRotating` parameter is set to `true`.
</docs>
<script setup lang="ts">
import { OLoading, OIconAdd } from '@opensig/opendesign';
</script>

<template>
  <div class="container">
    <OLoading visible :icon="OIconAdd" :wrapper="null" icon-rotating />
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100px;
  max-width: 200px;
  position: relative;
}
</style>
