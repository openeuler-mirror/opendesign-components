<docs lang="md">
<!-- zh-CN -->

### OScroller 滚动容器

`OScroller` 是内置滚动条的容器组件，它会自动创建可滚动区域并关联滚动条，无需手动指定 `target`。

适合需要独立滚动区域的场景，如侧边栏、列表、面板等。

<!-- en-US -->

### OScroller Container

`OScroller` is a container component with built-in scrollbar that automatically creates a scrollable area and associates a scrollbar, without needing to specify `target`.

Suitable for scenarios requiring independent scrolling areas, such as sidebars, lists, panels, etc.
</docs>

<script setup lang="ts">
import { OScroller } from '@opensig/opendesign';
</script>

<template>
  <div class="demo-scroller-wrap">
    <div class="demo-scroller-item">
      <h4>showType="always"</h4>
      <OScroller class="demo-scroller-container" show-type="always">
        <div v-for="i in 12" :key="i" class="demo-scroller-section">{{ i }}</div>
      </OScroller>
    </div>
    <div class="demo-scroller-item">
      <h4>showType="hover"</h4>
      <OScroller class="demo-scroller-container" show-type="hover">
        <div v-for="i in 12" :key="i" class="demo-scroller-section">{{ i }}</div>
      </OScroller>
    </div>
    <div class="demo-scroller-item">
      <h4>size="small"</h4>
      <OScroller class="demo-scroller-container" show-type="always" size="small">
        <div v-for="i in 12" :key="i" class="demo-scroller-section">{{ i }}</div>
      </OScroller>
    </div>
    <div class="demo-scroller-item">
      <h4>禁用横向滚动</h4>
      <OScroller class="demo-scroller-container" show-type="always" size="small" disabled-x>
        <div v-for="i in 12" :key="i" class="demo-scroller-section">{{ i }}</div>
      </OScroller>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-scroller-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.demo-scroller-item {
  flex: 1 1 280px;
}
.demo-scroller-container {
  height: 240px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-scroller-section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--o-font_size-h4);
  color: var(--o-color-info2);
  &:nth-child(odd) {
    background-color: var(--o-color-fill2);
  }
}
</style>
