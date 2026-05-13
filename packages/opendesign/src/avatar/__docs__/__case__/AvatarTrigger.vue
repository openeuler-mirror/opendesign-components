<docs lang="md">
<!-- zh-CN -->

### 可点击交互

设置 `clickable` 属性可让头像变为可点击状态，hover 时显示遮罩层。遮罩层会显示编辑图标。

<!-- en-US -->

### Clickable

Set `clickable` to enable clickable state, shows mask on hover. The mask displays an edit icon.
</docs>
<script setup lang="ts">
import { OAvatar, OIconEdit } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OAvatar :size="56" url="https://api.dicebear.com/9.x/micah/svg?seed=1" clickable />
    <OAvatar :size="56" name="User Name" clickable />
    <OAvatar :size="56" url="https://api.dicebear.com/9.x/micah/svg?seed=3" clickable>
      <template #trigger-icon>
        <OIconEdit />
      </template>
    </OAvatar>
  </div>
</template>
