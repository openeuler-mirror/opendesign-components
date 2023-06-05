<script setup lang="ts">
import { OPopover } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      <OPopover position="tl" trigger="click">
        <div class="box">OPopover content OPopover content OPopover content</div>
        <template #target>
          <div>Target Click</div>
        </template>
      </OPopover>

      <OPopover position="tl" trigger="hover">
        <div class="box">OPopover content OPopover content OPopover content</div>
        <template #target>
          <div>Target hover</div>
        </template>
      </OPopover>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
