<docs lang="md">
<!-- zh-CN -->

### 内联使用插槽

<!-- en-US -->

### Inline usage of slots
</docs>
<script setup lang="ts">
import { OToast, OLink, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <OToast>
    <span style="margin-right: 6px"> toast提示 </span>
    <OLink color="normal" style="--o-color-link1: var(--o-color-info1-inverse)">
      文字按钮
      <template #suffix><OIconChevronRight /> </template>
    </OLink>
  </OToast>
</template>
