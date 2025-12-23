<docs lang="md">
<!-- zh-CN -->

#### 图标按钮（仅含图标）

- **必传参数**：
  - `:icon="{iconName}"`（动态绑定图标组件）或通过`icon`插槽传入
- **尺寸控制**：通过 `size` 属性调整按钮大小

<!-- en-US -->

#### Icon Buttons (Icon-only button)

- **Mandatory Parameters**:
  - `:icon="iconName"` (dynamically binds the icon component), Or pass it in through the `icon` slot
- **Size Control**: Adjust the button size via the `font-size` property.
</docs>
<script setup lang="ts">
import { OButton, OIconEdit } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OButton :icon="OIconEdit" size="large"></OButton>
    <OButton :icon="OIconEdit"></OButton>
    <OButton :icon="OIconEdit" size="small"></OButton>
    <OButton :icon="OIconEdit" disabled></OButton>

    <OButton :icon="OIconEdit" size="large" variant="solid"></OButton>
    <OButton :icon="OIconEdit" variant="solid"></OButton>
    <OButton :icon="OIconEdit" size="small" variant="solid"></OButton>
    <OButton :icon="OIconEdit" disabled variant="solid"></OButton>


    <OButton :icon="OIconEdit" size="large" variant="outline"></OButton>
    <OButton :icon="OIconEdit" variant="outline"></OButton>
    <OButton :icon="OIconEdit" size="small" variant="outline"></OButton>
    <OButton :icon="OIconEdit" disabled variant="outline"></OButton>
  </div>
</template>
<style lang="scss" scoped>
.icon24 {
  font-size: var(--o-icon_size-m);
}
</style>
