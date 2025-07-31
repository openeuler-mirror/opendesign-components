<docs lang="md">
<!-- zh-CN -->

### 自定义标题

使用 `title` 插槽自定义标题内容

<!-- en-US -->

### Custom Title

Use the `title` slot to customize the title content
</docs>
<script setup lang="ts">
import { OAnchor, OAnchorItem, OIconLink } from '@opensig/opendesign';
</script>
<template>
  <OAnchor container="#wrap">
    <OAnchorItem href="#container-block1">
      <template #title><span class="anchor-title">container-block1<OIconLink /></span></template>
    </OAnchorItem>
  </OAnchor>
</template>
<style lang="scss" scoped>
.anchor-title {
  display: flex;
  align-items: center;
  svg {
    margin-left: 4px;
    font-size: var(--o-icon_size-xs);
  }
}
</style>