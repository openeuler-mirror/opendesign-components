<docs lang="md">
<!-- zh-CN -->

### 自定义图标

<!-- en-US -->

### Custom Icons
</docs>
<script setup lang="ts">
import { OMenu, OSubMenu, OMenuItem, OIconEdit, OIconCalendar } from '@opensig/opendesign';
</script>
<template>
  <OMenu>
    <OMenuItem value="home">
      <template #icon><img src="/favicon.ico" alt="home" class="home-icon" /></template>
      Home
    </OMenuItem>
    <OSubMenu value="edit" :icon="OIconEdit">
      <template #title>Edit</template>
      <OMenuItem value="undo">Undo</OMenuItem>
      <OMenuItem value="redo">Redo</OMenuItem>
    </OSubMenu>
    <OSubMenu value="calendar" :icon="OIconCalendar">
      <template #title>Calendar</template>
      <OMenuItem value="today">Today</OMenuItem>
      <OMenuItem value="yesterday">Yesterday</OMenuItem>
    </OSubMenu>
  </OMenu>
</template>
<style scoped lang="scss">
.home-icon {
  max-width: 1em;
  max-height: 1em;
}
</style>
