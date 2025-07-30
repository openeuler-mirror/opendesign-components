<docs lang="md">
<!-- zh-CN -->

### 自定义标题

通过 `title` 插槽可以自定义标题

<!-- en-US -->

### Custom Title

You can customize the title through the `title` slot
</docs>
<script setup lang="ts">
import { OCollapse, OCollapseItem, OIconFile } from '@opensig/opendesign';
</script>

<template>
  <OCollapse accordion>
    <OCollapseItem :value="1">
      <template #title>
        <OIconFile class="icon" />
        <span>title 1</span>
      </template>
      <div class="content1"></div>
    </OCollapseItem>
    <OCollapseItem title="title 2" :value="2">
      <template #title>
        <OIconFile class="icon" />
        <span>title 2</span>
      </template>
      <div class="content2"></div>
    </OCollapseItem>
  </OCollapse>
</template>
<style lang="scss" scoped>
.icon {
  font-size: var(--o-icon_size-m);
  margin-right: var(--o-gap-2);
}
.content1 {
  background-color: yellowgreen;
  height: 150px;
}
.content2 {
  background-color: lightblue;
  height: 200px;
}
</style>
