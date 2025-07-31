<docs lang="md">
<!-- zh-CN -->

### 自定义徽标内容

可以通过 `content` 插槽自定义徽标内容。如果不提供 `content` 插槽，则显示 `value` 值。

<!-- en-US -->

### Custom Badge Content

You can customize the badge content using the `content` slot. If the `content` slot is not provided, the `value` will be displayed.
</docs>
<script setup lang="ts">
import { OBadge, OIconChecked } from '@opensig/opendesign';
</script>
<template>
  <OBadge>
    <img src="/avatar.svg" alt="avatar" style="width: 48px; height: 48px" />
    <template #content>
      <OIconChecked />
    </template>
  </OBadge>
</template>
