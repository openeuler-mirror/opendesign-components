<script setup lang="ts">
import { OTag } from '../index';
import { IconAdd } from '../../icon';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OTag>Tag1</OTag>
    <OTag>Tag2</OTag>
    <OTag>
      <template #icon><IconAdd /></template>
      Icon Tag
    </OTag>
  </section>
</template>
