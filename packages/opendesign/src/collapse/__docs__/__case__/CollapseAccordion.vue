<docs lang="md">
<!-- zh-CN -->

### 手风琴

手风琴模式：`accordion` 设置为 `true` 时，折叠面板只能展开一个面板。

<!-- en-US -->

### Accordion

Accordion mode: When `accordion` is set to `true`, only one panel can be expanded.
</docs>

<script setup lang="ts">
import { OCollapse, OCollapseItem } from '@opensig/opendesign';
</script>
<template>
  <OCollapse accordion>
    <OCollapseItem title="title 1" :value="1">
      <div class="content1"></div>
    </OCollapseItem>
    <OCollapseItem title="title 2" :value="2">
      <div class="content2"></div>
    </OCollapseItem>
  </OCollapse>
</template>
<style lang="scss" scoped>
.content1 {
  background-color: yellowgreen;
  height: 150px;
}
.content2 {
  background-color: lightblue;
  height: 200px;
}
</style>
