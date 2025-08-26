<docs lang="md">
<!-- zh-CN -->

#### 文本按钮（无背景，无线框）

- **基础组件**：使用 `OLink` 组件实现
- **颜色**：文本按钮的颜色有 `normal`、`primary`、`success`、`warning`、`danger` 5种，默认为 `normal`
- **注意**：欧拉主题中文本按钮无 hover 下划线，因此不能配置 `hover-underline`

<!-- en-US -->

#### Text Buttons (No Background, No Border)

- **Base Component**: Implemented using the `OLink` component.
- **Color Options**: Text buttons have 5 color variants: `normal`, `primary`, `success`, `warning`, and `danger`, with `normal` as the default.
- **Note**: In the Euler theme, text buttons do not support hover underlines, so the `hover-underline` parameter should not be configured.
</docs>
<script setup lang="ts">
import { OLink, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OLink>Text Normal Button</OLink>
    <OLink disabled>Text Normal Disable Button</OLink>
    <OLink color="primary">Text Primary Button<template #suffix><OIconChevronRight /></template></OLink>
    <OLink color="success">Text Success Button</OLink>
    <OLink color="warning">Text Warning Button</OLink>
    <OLink color="danger">Text Danger Button</OLink>
  </div>
</template>
