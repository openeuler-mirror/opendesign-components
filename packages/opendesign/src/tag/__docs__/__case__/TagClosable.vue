<docs lang="md">
<!--zh-CN-->
### 可关闭按钮

<!--en-US-->
### Closeable
</docs>

<script setup lang="ts">
import { OTag } from '@opensig/opendesign';
const handleClose = () => {
  console.log('close!!!');
};
</script>

<template>
  <section>
    <OTag closable @close="handleClose">Tag1</OTag>
    <OTag color="primary" closable @close="handleClose">Tag2</OTag>
    <OTag color="success" closable @close="handleClose">Tag3</OTag>
    <OTag color="warning" closable @close="handleClose">Tag4</OTag>
    <OTag color="danger" closable @close="handleClose">Tag5</OTag>

    <OTag size="small" closable @close="handleClose">Tag1</OTag>
    <OTag color="primary" size="small" closable @close="handleClose">Tag2</OTag>
    <OTag color="success" size="small" closable @close="handleClose">Tag3</OTag>
    <OTag color="warning" size="small" closable @close="handleClose">Tag4</OTag>
    <OTag color="danger" size="small" closable @close="handleClose">Tag5</OTag>
  </section>
</template>
