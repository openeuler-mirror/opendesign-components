<script setup lang="ts">
import { OTag } from '../index';
const handleClose = () => {
  console.log('close!!!');
};
</script>

<template>
  <h4>可关闭按钮</h4>
  <section>
    <OTag closable @close="handleClose">Tag1</OTag>
    <OTag closable @close="handleClose">Tag2</OTag>
    <OTag closable @close="handleClose">Tag3</OTag>
    <OTag closable @close="handleClose">Tag4</OTag>
    <OTag closable @close="handleClose">Tag5</OTag>
  </section>
</template>
