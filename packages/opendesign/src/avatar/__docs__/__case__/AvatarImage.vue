<docs lang="md">
<!-- zh-CN -->

### 图片头像

通过 `url` 设置图片地址，使用 `object-fit` 控制图片在容器内的填充方式。

<!-- en-US -->

### Image Avatar

Set image URL via `url`, use `object-fit` to control how the image fills the container.
</docs>
<script setup lang="ts">
import { OAvatar } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OAvatar :size="56" url="https://api.dicebear.com/9.x/micah/svg?seed=1" object-fit="cover" />
    <OAvatar :size="56" url="https://api.dicebear.com/9.x/micah/svg?seed=2" object-fit="contain" />
    <OAvatar :size="56" url="https://api.dicebear.com/9.x/micah/svg?seed=3" object-fit="fill" />
  </div>
</template>
