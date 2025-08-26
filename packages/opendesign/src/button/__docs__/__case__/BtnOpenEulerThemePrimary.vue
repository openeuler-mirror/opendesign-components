<docs lang="md">
<!-- zh-CN -->

### 欧拉主题规范

所有欧拉主题按钮需满足圆角为半圆的视觉规范，通过 `round="pill"` 参数统一设置圆角样式。

#### 按钮类型及配置说明

#### 主要按钮（主操作按钮）

- **功能定位**：页面核心操作的主按钮（如提交、确认）
- **配置方式**：需同时传递两个参数
  `color="primary"`（标识颜色为主题色） + `variant="solid"`（实心样式）

<!-- en-US -->

### Euler Theme Specifications

All Euler-themed buttons must adhere to the visual specification of having semi-circular (half-pill) borders, with the border radius style uniformly configured via the `round="pill"` parameter.

#### Button Types and Configuration Instructions

#### Primary Buttons (Main Action Buttons)

- **Functional Positioning**: Primary button for core page operations (e.g., submission, confirmation).
- **Configuration Method**: Requires passing two parameters simultaneously:
  `color="primary"` (indicates the color as the theme color) + `variant="solid"` (solid style).
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton size="large" round="pill" color="primary" variant="solid">Primary Button</OButton>
    <OButton loading round="pill" color="primary" variant="solid">Primary Button</OButton>
    <OButton disabled round="pill" color="primary" variant="solid">Primary Button</OButton>
  </div>
</template>
