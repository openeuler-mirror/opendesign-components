<docs lang="md">
<!-- zh-CN -->

#### 文本按钮（无背景，无线框）

- **基础组件**：使用 `OLink` 组件实现
- **颜色**：文本按钮的颜色有 `normal`、`primary`、`success`、`warning`、`danger` 5种，默认为 `normal`
- **注意**：欧拉主题中文本按钮无 hover 下划线，因此需显式设置 `hover-underline="false"`

<!-- en-US -->

#### Text Buttons (No Background, No Border)

- **Base Component**: Implemented using the `OLink` component.
- **Color Options**: Text buttons have 5 color variants: `normal`, `primary`, `success`, `warning`, and `danger`, with `normal` as the default.
- **Note**: In the Euler theme, text buttons do not have hover underlines, so you need to explicitly set `hover-underline="false"`.
</docs>
<script setup lang="ts">
import { resolveComponent, type Component } from 'vue';
import { OLink, OIconChevronRight } from '@opensig/opendesign';

const DocIconMenu = resolveComponent('DocIconMenu') as Component;
</script>
<template>
  <div class="row">
    <div>
      <p>默认样式</p>
      <div>
        <OLink :hover-underline="false">文本按钮</OLink>
        <OLink :hover-underline="false"
          >文本按钮<template #suffix><OIconChevronRight /></template
        ></OLink>
        <OLink :hover-underline="false"
          ><template #icon><DocIconMenu /></template>文本按钮</OLink
        >
      </div>
    </div>
    <div>
      <p>变体</p>
      <div>
        <OLink color="primary" :hover-underline="false">文本按钮</OLink>
        <OLink color="success" :hover-underline="false">文本按钮</OLink>
        <OLink color="warning" :hover-underline="false">文本按钮</OLink>
        <OLink color="danger" :hover-underline="false">文本按钮</OLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div + div {
  margin-left: 48px;
}
.o-link + .o-link {
  margin-left: 24px;
}
</style>
