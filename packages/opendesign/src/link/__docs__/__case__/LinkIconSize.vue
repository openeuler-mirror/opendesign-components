<docs lang="md">
<!-- zh-CN -->

### 插槽及大小

可以通过`icon`插槽设置链接左侧内容，通过`suffix`插槽设置链接右侧内容，通过`size`属性设置链接大小。

<!-- en-US -->

### Slots

The Link icon can be set using the `icon` slot, and the link suffix can be set using the `suffix` slot, and the link size can be set using the `size` property.
</docs>
<script setup lang="ts">
import { OLink } from '@opensig/opendesign';
import { OIconEye, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OLink size="medium" color="warning">
      <template #icon><OIconEye /></template>
      了解更多
    </OLink>
    <OLink size="medium" color="warning">
      <template #suffix><OIconChevronRight /></template>
      了解更多
    </OLink>
    <OLink size="medium" color="warning">
      <template #icon><OIconEye /></template>
      <template #suffix><OIconChevronRight /></template>
      了解更多
    </OLink>
  </div>
  <div class="row">
    <OLink color="success">
      <template #icon><OIconEye /></template>
    </OLink>
    <OLink color="success" size="small">
      <template #icon><OIconEye /></template>
    </OLink>
    <OLink color="success" size="medium">
      <template #icon><OIconEye /></template>
    </OLink>
    <OLink color="success" size="large">
      <template #icon><OIconEye /></template>
    </OLink>
  </div>
</template>
<style scoped lang="scss">
.o-link {
  display: flex;
  align-items: center;
  width: fit-content;
}
</style>
