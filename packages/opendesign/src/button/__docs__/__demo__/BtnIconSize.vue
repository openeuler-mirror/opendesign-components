<docs lang="md">
---
title:
  zh-CN: icon插槽及按钮大小
  en-US: Icon Slot and Button Size
---

# zh-CN

可以通过`icon`插槽设置按钮图标，通过`size`属性设置按钮大小。

# en-US
The button icon can be set using the `icon` slot, and the button size can be adjusted via the `size` prop.
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
import { OIconAdd } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton variant="solid" size="small">
      <template #icon><OIconAdd /></template>small Button
    </OButton>
    <OButton variant="solid" size="medium">
      <template #icon><OIconAdd /></template>outline Button
    </OButton>
    <OButton variant="solid" size="large">
      <template #icon><OIconAdd /></template>large Button
    </OButton>
  </div>
  <div class="row">
    <OButton variant="outline" size="small">
      <template #icon><OIconAdd /></template>small Button
    </OButton>
    <OButton variant="outline">
      <template #icon><OIconAdd /></template>outline Button
    </OButton>
    <OButton variant="outline" size="large" :icon="OIconAdd">
      <template #suffix><OIconAdd /></template>large Button
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
