<script setup lang="ts">
import { OTag } from '../index';
import { OIconAdd } from '../../icon-components';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OTag>Tag1</OTag>
    <OTag>Tag2</OTag>
    <OTag>
      <template #icon><OIconAdd /></template>
      Icon Tag
    </OTag>
  </section>
</template>
