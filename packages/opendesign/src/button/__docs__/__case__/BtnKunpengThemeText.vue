<docs lang="md">
<!-- zh-CN -->

#### 文本按钮（无背景，无线框）

- **基础组件**：使用 `OLink` 组件实现
- **通用配置**：必须传递 `hover-underline` 参数（鼠标悬停时显示下划线）
- **hover特殊颜色**：因为鲲鹏主题要求文本按钮hover时文字变红并显示红色下划线，所以需要给 `OLink` 组件添加 `c-link-kunpeng` 类名

<!-- en-US -->

#### Text Buttons (No Background, No Border)

- **Base Component**: Implemented using the `OLink` component.
- **General Configuration**: Must pass the `hover-underline` parameter (displays an underline on mouse hover).
- **Hover Special Color**: Because the Kunpeng theme requires text buttons to display red text and a red underline on hover,
  the `OLink` component needs to have the `c-link-kunpeng` class name added.

</docs>
<script setup lang="ts">
import { OLink, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OLink hover-underline class="c-link-kunpeng">Text Button</OLink>
    <OLink hover-underline class="c-link-kunpeng" disabled>Text Button<template #suffix><OIconChevronRight /></template></OLink>
  </div>
</template>
