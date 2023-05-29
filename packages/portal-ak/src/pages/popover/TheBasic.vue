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
<style lang="scss" scoped>
.page-demo {
  padding-bottom: 400px;
}
.select-add {
  border-top: 1px solid var(--o-color-control1);
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: var(--o-color-link1);
  }
}
</style>
