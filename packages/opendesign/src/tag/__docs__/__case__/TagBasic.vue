<docs lang="md">
<!-- zh-CN -->

### 基础用法

<!-- en-US -->

### Basic Usage
</docs>

<script setup lang="ts">
import { OTag, OIconAdd } from '@opensig/opendesign';

const handleClose = () => {
  console.log('close!!!');
};
</script>

<template>
  <div class="col">
    <div class="grid">
      <!-- 实心 -->
      <OTag>Normal</OTag>
      <OTag color="primary">Primary</OTag>
      <OTag color="success">Success</OTag>
      <OTag color="pending">Pending</OTag>
      <OTag color="disabled">Finished</OTag>
      <OTag color="warning">Warning</OTag>
      <OTag color="danger">Danger</OTag>
      <OTag color="main2">Main2</OTag>

      <!-- 实心 + 图标 -->
      <OTag>
        <template #icon><OIconAdd /></template>
        Normal
      </OTag>
      <OTag color="primary">
        <template #icon><OIconAdd /></template>
        Primary
      </OTag>
      <OTag color="success">
        <template #icon><OIconAdd /></template>
        Success
      </OTag>
      <OTag color="pending">
        <template #icon><OIconAdd /></template>
        Pending
      </OTag>
      <OTag color="disabled">
        <template #icon><OIconAdd /></template>
        Finished
      </OTag>
      <OTag color="warning">
        <template #icon><OIconAdd /></template>
        Warning
      </OTag>
      <OTag color="danger">
        <template #icon><OIconAdd /></template>
        Danger
      </OTag>
      <OTag color="main2">
        <template #icon><OIconAdd /></template>
        Main2
      </OTag>

      <!-- 实心 + 可关闭 -->
      <OTag closable @close="handleClose">Normal</OTag>
      <OTag color="primary" closable @close="handleClose">Primary</OTag>
      <OTag color="success" closable @close="handleClose">Success</OTag>
      <OTag color="pending" closable @close="handleClose">Pending</OTag>
      <OTag color="disabled" closable @close="handleClose">Finished</OTag>
      <OTag color="warning" closable @close="handleClose">Warning</OTag>
      <OTag color="danger" closable @close="handleClose">Danger</OTag>
      <OTag color="main2" closable @close="handleClose">Main2</OTag>

      <!-- 描边 -->
      <OTag variant="outline">Normal</OTag>
      <OTag color="primary" variant="outline">Primary</OTag>
      <OTag color="success" variant="outline">Success</OTag>
      <OTag color="pending" variant="outline">Pending</OTag>
      <OTag color="disabled" variant="outline">Finished</OTag>
      <OTag color="warning" variant="outline">Warning</OTag>
      <OTag color="danger" variant="outline">Danger</OTag>
      <OTag color="main2" variant="outline">Main2</OTag>

      <!-- 描边 + 可关闭 -->
      <OTag variant="outline" closable @close="handleClose">Normal</OTag>
      <OTag color="primary" closable variant="outline" @close="handleClose">Primary</OTag>
      <OTag color="success" closable variant="outline" @close="handleClose">Success</OTag>
      <OTag color="pending" closable variant="outline" @close="handleClose">Pending</OTag>
      <OTag color="disabled" closable variant="outline" @close="handleClose">Finished</OTag>
      <OTag color="warning" closable variant="outline" @close="handleClose">Warning</OTag>
      <OTag color="danger" closable variant="outline" @close="handleClose">Danger</OTag>
      <OTag color="main2" closable variant="outline" @close="handleClose">Main2</OTag>

      <!-- 描边 + 图标 -->
      <OTag variant="outline">
        <template #icon><OIconAdd /></template>
        Normal
      </OTag>
      <OTag color="primary" variant="outline">
        <template #icon><OIconAdd /></template>
        Primary
      </OTag>
      <OTag color="success" variant="outline">
        <template #icon><OIconAdd /></template>
        Success
      </OTag>
      <OTag color="pending" variant="outline">
        <template #icon><OIconAdd /></template>
        Pending
      </OTag>
      <OTag color="disabled" variant="outline">
        <template #icon><OIconAdd /></template>
        Finished
      </OTag>
      <OTag color="warning" variant="outline">
        <template #icon><OIconAdd /></template>
        Warning
      </OTag>
      <OTag color="danger" variant="outline">
        <template #icon><OIconAdd /></template>
        Danger
      </OTag>
      <OTag color="main2" variant="outline">
        <template #icon><OIconAdd /></template>
        Main2
      </OTag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.col {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
.grid {
  display: grid;
  grid-template-columns: repeat(8, auto);
  gap: var(--o-r-gap-3) var(--o-r-gap-2);
}
</style>
