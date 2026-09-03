<docs lang="md">
<!-- zh-CN -->

### 动态内容与自动刷新

当滚动容器内容尺寸动态变化时，滚动条需要重新计算。组件提供了两种机制：

- **自动响应**：通过 `ResizeObserver` 监听容器及其直接子元素尺寸变化，自动刷新滚动条
- **轮询刷新**：当 `showType="always"` 且设置 `autoUpdateOnScrollSize` 时，通过定时器轮询检测 `scrollWidth`/`scrollHeight` 变化

`autoUpdateOnScrollSize` 适用于内容通过异步加载或非标准方式更新尺寸（如图片懒加载撑高容器）的场景。

<!-- en-US -->

### Dynamic Content and Auto-refresh

When the scroll container's content size changes dynamically, the scrollbar needs recalculation. The component provides two mechanisms:

- **Auto response**: Monitors the container and its direct children via `ResizeObserver`, refreshing the scrollbar automatically
- **Polling refresh**: When `showType="always"` with `autoUpdateOnScrollSize`, polls for `scrollWidth`/`scrollHeight` changes via a timer

`autoUpdateOnScrollSize` is suitable for scenarios where content updates size asynchronously (e.g., lazy-loaded images expanding the container).
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OScroller } from '@opensig/opendesign';

const contentHeight = ref(120);
const toggleHeight = () => {
  contentHeight.value = contentHeight.value === 120 ? 600 : 120;
};
</script>

<template>
  <div class="demo-dynamic-wrap">
    <div class="demo-dynamic-actions">
      <button class="demo-dynamic-btn" @click="toggleHeight">切换内容高度 ({{ contentHeight }}px)</button>
    </div>
    <div class="demo-dynamic-item">
      <h4>ResizeObserver 自动响应</h4>
      <OScroller class="demo-dynamic-container" show-type="always">
        <div class="demo-dynamic-content" :style="{ height: `${contentHeight}px` }">内容高度：{{ contentHeight }}px</div>
      </OScroller>
    </div>
    <div class="demo-dynamic-item">
      <h4>autoUpdateOnScrollSize 轮询刷新</h4>
      <OScroller class="demo-dynamic-container" show-type="always" auto-update-on-scroll-size>
        <div class="demo-dynamic-content" :style="{ height: `${contentHeight}px` }">内容高度：{{ contentHeight }}px</div>
      </OScroller>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-dynamic-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.demo-dynamic-actions {
  width: 100%;
}
.demo-dynamic-btn {
  padding: 6px 16px;
  border: 1px solid var(--o-color-control2);
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-control1-light);
  color: var(--o-color-info1);
  cursor: pointer;
  font-size: var(--o-font_size-text1);
  &:hover {
    border-color: var(--o-color-primary3);
    color: var(--o-color-primary3);
  }
}
.demo-dynamic-item {
  flex: 1 1 280px;
}
.demo-dynamic-container {
  height: 240px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-dynamic-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--o-font_size-h4);
  color: var(--o-color-info2);
  background-color: var(--o-color-fill2);
  transition: height var(--o-duration-m2) var(--o-easing-standard-in);
}
</style>
