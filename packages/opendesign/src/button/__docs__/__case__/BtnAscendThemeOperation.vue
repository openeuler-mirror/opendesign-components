<docs lang="md">
<!-- zh-CN -->

### 昇腾主题规范

所有昇腾主题按钮需满足圆角为半圆的视觉规范，通过 `round="pill"` 参数统一设置圆角样式。

#### 按钮类型及配置说明

#### 运营按钮

- **功能定位**：用于运营活动相关的按钮交互
- **配置方式**：为按钮组件添加类名 `c-btn-activity` 或 `c-btn-ascend`（二选一）

<!-- en-US -->

### Ascend Theme Specifications

All ascend-themed buttons must adhere to the visual specification of having semi-circular (half-pill) borders, with the border radius style uniformly configured via the `round="pill"` parameter.

#### Button Types and Configuration Instructions

#### Operational Buttons

- **Functional Positioning**: Used for button interactions related to operational activities.
- **Configuration Method**: Add either the class name `c-btn-activity` or `c-btn-ascend` (choose one) to the button component.
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton size="large" round="pill" class="c-btn-activity">Operation Button</OButton>
    <OButton loading round="pill" class="c-btn-ascend">Operation Button</OButton>
    <OButton disabled round="pill" class="c-btn-activity">Operation Button</OButton>
  </div>
</template>
