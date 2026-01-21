<docs lang="md">
<!-- zh-CN -->

#### 强调按钮

- **功能定位**：页面核心操作的主按钮（如提交、确认）
- **配置方式**：需同时传递两个参数
`color="primary"`（标识颜色为主题色） + `variant="solid"`（实心样式）
<!-- en-US -->

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
