<script setup lang="ts">
import { OPopover } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      M:
      <OPopover position="tl" trigger="click" :edge-offset="24">
        <div class="box">OPopover content OPopover content OPopover content</div>
        <template #target>
          <div>Target Click</div>
        </template>
      </OPopover>

      <OPopover position="tl" trigger="hover" :edge-offset="24">
        <div class="box">OPopover content OPopover content OPopover content</div>
        <template #target>
          <div>Target hover</div>
        </template>
      </OPopover>
    </section>
    <section>
      L:
      <OPopover position="tl" trigger="click" class="c-popover-lg" :edge-offset="24">
        <div class="title">title</div>
        <div class="detail">OPopover content OPopover content</div>
        <template #target>
          <div>Target click</div>
        </template>
      </OPopover>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
  color: var(--o-color-info1);
}
.detail {
  margin-top: 4px;
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  color: var(--o-color-info2);
}
</style>
