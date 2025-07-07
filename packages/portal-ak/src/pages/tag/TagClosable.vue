<script setup lang="ts">
import { OTag } from '@opendesign-src/index';
const handleClose = () => {
  console.log('close!!!');
};
</script>

<template>
  <h3>可删除标签</h3>
  <section>
    <OTag round="pill" closable @close="handleClose">可操作标签1</OTag>
    <OTag round="pill" closable @close="handleClose">可操作标签2</OTag>
    <OTag round="pill" closable @close="handleClose">可操作标签3</OTag>
  </section>
</template>
