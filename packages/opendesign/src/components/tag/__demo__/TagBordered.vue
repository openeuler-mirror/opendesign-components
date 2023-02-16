<script setup lang="ts">
import { OTag } from '../index';
</script>

<template>
  <h4>带边框标签</h4>
  <section>
    <OTag bordered>Tag1</OTag>
    <OTag status="success" bordered>Tag2</OTag>
    <OTag status="warning" bordered>Tag3</OTag>
    <OTag status="danger" bordered>Tag4</OTag>
  </section>
</template>
