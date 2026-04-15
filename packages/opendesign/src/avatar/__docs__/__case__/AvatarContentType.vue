<docs lang="md">
<!-- zh-CN -->

### 内容类型

头像根据 `url` 和 `name` 的组合自动选择展示内容：

- **有 url**：展示图片（加载失败时回退为默认图标）
- **无 url 有 name**：展示 `name` 的首字符，或通过 `#name` 插槽自定义
- **无 url 无 name**：展示默认头像图标

<!-- en-US -->

### Content Types

Avatar automatically selects display content based on `url` and `name`:

- **With url**: displays image (falls back to default icon on load error)
- **Without url but with name**: displays first character of `name`, or customize via `#name` slot
- **Without url and name**: displays default avatar icon
</docs>
<script setup lang="ts">
import { OAvatar } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OAvatar url="https://api.dicebear.com/9.x/micah/svg?seed=1" />
    <OAvatar name="Alice" />
    <OAvatar />
    <OAvatar name="Custom">
      <template #name><b>Hi</b></template>
    </OAvatar>
  </div>
</template>
