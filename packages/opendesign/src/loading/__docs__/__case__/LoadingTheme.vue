<docs lang="md">
<!-- zh-CN -->

### 主题规范

根据主题规范，`OLoading` 组件具有 5 种类型，不同的类型图标尺寸不同且标签样式也不同，可通过 `main-class` 设置类名实现

- 页面加载
  - L: `c-loading-lg`
  - M: `c-loading-md`
  - S: `c-loading-sm`
- 组件加载
  - L: `c-loading-comp-sm`
  - M: `c-loading-xs`

<!-- en-US -->

### Theme Specification

According to the theme specification, the `OLoading` component has 5 types.
Different types have different icon sizes and label styles, which can be implemented by setting the class name via `main-class`.

- Page Loading
  - L: `c-loading-lg`
  - M: `c-loading-md`
  - S: `c-loading-sm`
- Component Loading
  - L: `c-loading-comp-sm`
  - M: `c-loading-xs`
</docs>
<script setup lang="ts">
import { OLoading } from '@opensig/opendesign';
</script>
<template>
  <div class="loading-group">
    <div class="loading-item">
      <OLoading visible :wrapper="null" label="Page large" main-class="c-loading-lg" />
    </div>
    <div class="loading-item">
      <OLoading visible :wrapper="null" label="Page middle" main-class="c-loading-md" />
    </div>
    <div class="loading-item">
      <OLoading visible :wrapper="null" label="Page small" main-class="c-loading-sm" />
    </div>
    <div class="loading-item">
      Component large
      <OLoading visible :wrapper="null" main-class="c-loading-comp-sm" />
    </div>
    <div class="loading-item">
      Component middle
      <OLoading visible :wrapper="null" main-class="c-loading-xs" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .loading-item {
    width: 300px;
    height: 200px;
    color: var(--o-color-info1-inverse);
    background-color: pink;
    position: relative;
    text-align: center;
  }
}
</style>
