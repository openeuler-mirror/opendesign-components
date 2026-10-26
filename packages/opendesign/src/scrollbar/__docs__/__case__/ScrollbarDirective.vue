<docs lang="md">
<!-- zh-CN -->

### 指令 v-scrollbar

通过 `v-scrollbar` 指令为任意元素添加自定义滚动条，无需在模板中额外放置 `<OScrollbar>` 组件。

- 指令值可传 `false` 禁用滚动条
- 指令值可传属性对象，支持 `showType`、`size`、`duration` 等所有基础属性

> 指令始终将滚动条挂载到元素的父元素，父元素应仅包含滚动容器并设置 `position: relative`，否则滚动条会超出容器边界。

<!-- en-US -->

### v-scrollbar Directive

Add custom scrollbars to any element via the `v-scrollbar` directive, without placing an `<OScrollbar>` component in the template.

- Pass `false` to disable the scrollbar
- Pass a props object to configure `showType`, `size`, `duration`, etc.

> The directive always mounts the scrollbar to the element's parent, so the parent should contain only the scroll container with `position: relative` — otherwise the scrollbar may extend beyond the container's boundaries.
</docs>

<script setup lang="ts">
import { vScrollbar, type BaseScrollerPropsT } from '@opensig/opendesign';

const setting: Partial<BaseScrollerPropsT> = {
  showType: 'always',
  size: 'small',
};
</script>

<template>
  <div class="demo-directive-wrap">
    <div class="demo-directive-item">
      <h4>对象配置</h4>
      <div class="demo-directive-scrollbar">
        <div v-scrollbar="setting" class="demo-directive-container">
          <div v-for="i in 15" :key="i" class="demo-directive-section">{{ i }}</div>
        </div>
      </div>
    </div>
    <div class="demo-directive-item">
      <h4>内联配置</h4>
      <div class="demo-directive-scrollbar">
        <div v-scrollbar="{ showType: 'always', size: 'small', autoUpdateOnScrollSize: true }" class="demo-directive-container">
          <div v-for="i in 15" :key="i" class="demo-directive-section">{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-directive-wrap {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.demo-directive-item {
  flex: 1 1 280px;
}
.demo-directive-scrollbar {
  position: relative;
}
.demo-directive-container {
  height: 220px;
  overflow: auto;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-directive-section {
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
