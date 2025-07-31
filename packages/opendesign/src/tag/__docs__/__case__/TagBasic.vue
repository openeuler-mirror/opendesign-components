<docs lang="md">
<!--zh-CN-->
### 基础用法

<!--en-US-->
### Basic Usage
</docs>

<script setup lang="ts">
import { OTag, OIconAdd } from '@opensig/opendesign';
</script>

<template>
  <section>
    <OTag>Tag1</OTag>
    <OTag>Tag2</OTag>
    <OTag>
      <template #icon><OIconAdd /></template>
      Icon Tag
    </OTag>
  </section>
</template>
