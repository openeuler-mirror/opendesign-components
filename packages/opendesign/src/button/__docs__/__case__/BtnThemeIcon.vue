<docs lang="md">
<!-- zh-CN -->

#### 图标按钮（仅含图标）

- **基础组件**：使用 `OIcon` 组件实现
- **必传参数**：
  - `button`（标识组件为按钮类型）
  - `:icon="iconName"`（动态绑定图标组件）
- **尺寸控制**：通过 `font-size` 属性调整按钮大小（支持内联样式或 CSS 类名方式）
<!-- en-US -->

#### Icon Buttons (Icon-only button)

- **Base Component**: Implemented using the `OIcon` component.
- **Mandatory Parameters**:
  - `button` (identifies the component as a button type).
  - `:icon="iconName"` (dynamically binds the icon component).
- **Size Control**: Adjust the button size via the `font-size` property (supports inline styles or CSS class names).
</docs>
<script setup lang="ts">
import { OIcon, OIconEdit } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OIcon button :icon="OIconEdit" class="icon24" />
    <OIcon button :icon="OIconEdit" disabled class="icon24" />
  </div>
</template>
<style lang="scss" scoped>
.icon24 {
  font-size: var(--o-icon_size-m);
}
</style>
