<script setup lang="ts">
import { OTag } from '../index';
</script>

<template>
  <h4>带边框标签</h4>
  <section>
    <OTag variant="outline">Tag1</OTag>
    <OTag color="primary" variant="outline">Tag2</OTag>
    <OTag color="success" variant="outline">Tag2</OTag>
    <OTag color="warning" variant="outline">Tag3</OTag>
    <OTag color="danger" variant="outline">Tag4</OTag>

    <OTag variant="outline" closable>Tag1</OTag>
    <OTag color="primary" closable variant="outline">Tag2</OTag>
    <OTag color="success" closable variant="outline">Tag2</OTag>
    <OTag color="warning" closable variant="outline">Tag3</OTag>
    <OTag color="danger" closable variant="outline">Tag4</OTag>
  </section>
</template>
