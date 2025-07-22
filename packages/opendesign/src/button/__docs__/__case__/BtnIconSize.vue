<docs lang="md">
<!-- zh-CN -->

### 插槽及大小

可以通过`icon`插槽设置按钮左侧内容，通过`suffix`插槽设置按钮右侧内容，通过`size`属性设置按钮大小。

<!-- en-US -->

### Slots

The button icon can be set using the `icon` slot, and the button suffix can be set using the `suffix` slot, and the button size can be set using the `size` property.
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
import { OIconAdd, OIconSearch } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton variant="solid" size="small">
      <template #icon><OIconAdd /></template>small button with icon slot
    </OButton>
    <OButton variant="solid" size="medium">
      <template #suffix><OIconSearch /></template>medium button with suffix slot
    </OButton>
  </div>
  <div class="row">
    <OButton variant="text" size="small">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="text">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="text" size="large">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="outline" size="small" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="outline" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="outline" size="large" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="solid" size="small" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="solid" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
    <OButton variant="solid" size="large" round="pill">
      <template #icon><OIconAdd /></template>
    </OButton>
  </div>
</template>
