<docs lang="md">
<!-- zh-CN -->

### 外部目标映射

`OScrollbar` 通过 `target` 属性可以关联任意外部滚动容器，滚动条不必与滚动容器在 DOM 层级上紧邻。

- `target` 接受 `HTMLElement`、`ref` 或选择器字符串
- 当 `target` 为 `'body'` 时，将为整个页面挂载滚动条
- 滚动条会自动定位在目标容器的边界上

<!-- en-US -->

### External Target Mapping

`OScrollbar` can associate any external scroll container via the `target` prop, without requiring the scrollbar to be adjacent to the scroll container in the DOM hierarchy.

- `target` accepts `HTMLElement`, `ref`, or selector string
- When `target` is `'body'`, a scrollbar is mounted for the entire page
- The scrollbar automatically positions at the target container's bounds
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OScrollbar } from '@opensig/opendesign';

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="demo-target-wrap">
    <div class="demo-target-source" ref="containerRef">
      <div v-for="i in 15" :key="i" class="demo-target-section">{{ i }}</div>
    </div>
    <div class="demo-target-aside">
      <h4>映射窗口</h4>
      <div class="demo-target-mirror">
        <OScrollbar show-type="always" size="small" :target="containerRef" />
      </div>
      <p class="demo-target-tip">滚动条通过 <code>target</code> 指向上方容器</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-target-wrap {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.demo-target-source {
  flex: 1;
  height: 220px;
  overflow: auto;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-target-aside {
  width: 160px;
}
.demo-target-mirror {
  position: relative;
  height: 220px;
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius_control-s);
}
.demo-target-section {
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
.demo-target-tip {
  margin-top: 8px;
  font-size: var(--o-font_size-text2);
  color: var(--o-color-info3);
}
</style>
