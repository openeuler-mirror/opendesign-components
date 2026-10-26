<docs lang="md">
<!-- zh-CN -->

### useScrollbar

通过 `useScrollbar` 组合式函数以编程方式创建滚动条，适用于需要在 JS 逻辑中动态挂载滚动条的场景。

- `target` 指定滚动容器，支持 `ref`、`HTMLElement` 或选择器字符串
- `wrapper` 可选，指定滚动条挂载的父元素；不传则自动挂载到 `target` 的父元素
- 返回 `scrollbar` 实例引用和 `unmount` 清理函数
- 当 `target` 为 `'body'` 时，将为整个页面创建滚动条

> `wrapper` 省略时滚动条以绝对定位填充父元素，父元素应仅包含滚动容器，否则滚动条会超出容器边界。若父元素包含其他内容，请通过 `wrapper` 指定一个仅包裹滚动容器的元素并设置 `position: relative`。

<!-- en-US -->

### useScrollbar

Create scrollbars programmatically via the `useScrollbar` composable, suitable for scenarios requiring dynamic mounting in JS logic.

- `target` specifies the scroll container, accepting `ref`, `HTMLElement`, or selector string
- `wrapper` is optional, specifying the parent element for scrollbar mounting; if omitted, it mounts to `target`'s parent
- Returns a `scrollbar` instance reference and an `unmount` cleanup function
- When `target` is `'body'`, a scrollbar is created for the entire page

> When `wrapper` is omitted, the scrollbar fills the parent element via absolute positioning; the parent should contain only the scroll container — otherwise the scrollbar may extend beyond the container's boundaries. If the parent contains other content, specify a dedicated `wrapper` element that wraps only the scroll container with `position: relative`.
</docs>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useScrollbar } from '@opensig/opendesign';

const containerRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);

const { scrollbar, unmount } = useScrollbar({
  wrapper: wrapperRef,
  target: containerRef,
  showType: 'always',
  size: 'small',
});

onUnmounted(() => {
  unmount();
});
</script>

<template>
  <div ref="wrapperRef" class="demo-hook-wrap">
    <div ref="containerRef" class="demo-hook-container">
      <div v-for="i in 15" :key="i" class="demo-hook-section">{{ i }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-hook-wrap {
  position: relative;
  max-width: 400px;
}
.demo-hook-container {
  height: 220px;
  overflow: auto;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-hook-section {
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
