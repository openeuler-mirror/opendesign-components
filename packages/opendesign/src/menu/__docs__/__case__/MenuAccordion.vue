<docs lang="md">
<!-- zh-CN -->

### 手风琴

<!-- en-US -->

### Accordion
</docs>
<script setup lang="ts">
import { OMenu, OSubMenu, OMenuItem } from '@opensig/opendesign';
</script>
<template>
  <OMenu accordion>
    <OSubMenu value="1">
      <template #title>Sub menu 1</template>
      <OMenuItem value="1-1">Item 1-1</OMenuItem>
      <OMenuItem value="1-2">Item 1-2</OMenuItem>
    </OSubMenu>
    <OSubMenu value="2">
      <template #title>Sub menu 2</template>
      <OMenuItem value="2-1">Item 2-1</OMenuItem>
      <OSubMenu value="2-2">
        <template #title>Sub menu 2-2</template>
        <OMenuItem value="2-2-1" disabled>Item 2-2-1</OMenuItem>
      </OSubMenu>
      <OSubMenu value="2-3">
        <template #title>Sub menu 2-3</template>
        <OMenuItem value="2-3-1">Item 2-3-1</OMenuItem>
      </OSubMenu>
    </OSubMenu>
  </OMenu>
</template>
