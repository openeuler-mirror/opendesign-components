<docs lang="md">
<!-- zh-CN -->

#### 普通按钮

- **功能定位**：辅助性操作按钮（如取消、返回）
- **配置方式**：需同时传递两个参数
  `color="primary"`（标识颜色为主题色） + `variant="outline"`（线框样式）

<!-- en-US -->

#### Normal Buttons

- **Functional Positioning**: Auxiliary action buttons (e.g., cancellation, return).
- **Configuration Method**: Requires passing two parameters simultaneously:
  `color="primary"` (indicates the color as the theme color) + `variant="outline"` (outline style).
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton size="large" round="pill" color="primary" variant="outline">Normal Button</OButton>
    <OButton loading round="pill" color="primary" variant="outline">Normal Button</OButton>
    <OButton disabled round="pill" color="primary" variant="outline">Normal Button</OButton>
  </div>
</template>
