<docs lang="md">
<!-- zh-CN -->

#### 文本按钮（无背景，无线框）

- **基础组件**：使用 `OLink` 组件实现
- **通用配置**：必须传递 `hover-underline` 参数（鼠标悬停时显示下划线）
- **特殊类型：箭头文本按钮**
  需额外完成以下配置：
  - 添加类名 `c-link-ascend`
  - 通过 `suffix` 插槽嵌入箭头图标，示例代码：
    ```vue
    <template>
      <OLink hover-underline class="c-link-ascend">
        按钮文本
        <template #suffix>
          <div class="c-link-ascend-arrow"></div>
        </template>
      </OLink>
    </template>
    ```

<!-- en-US -->

#### Text Buttons (No Background, No Border)

- **Base Component**: Implemented using the `OLink` component.
- **General Configuration**: Must pass the `hover-underline` parameter (displays an underline on mouse hover).
- **Special Type: Arrow Text Button**:
  Requires additional configuration as follows:
  - Add the class name `c-link-ascend`.
  - Embed the arrow icon via the `suffix` slot. Example code:
    ```vue
    <template>
      <OLink hover-underline class="c-link-ascend">
        Button Text
        <template #suffix>
          <div class="c-link-ascend-arrow"></div>
        </template>
      </OLink>
    </template>
    ```
</docs>
<script setup lang="ts">
import { OLink, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OLink hover-underline class="c-link-ascend">Text Arrow Button<template #suffix><div class="c-link-ascend-arrow"></div></template></OLink>
    <OLink hover-underline>Text Button</OLink>
    <OLink hover-underline class="c-link-ascend" disabled>Text Arrow Button<template #suffix><div class="c-link-ascend-arrow"></div></template></OLink>
    <OLink hover-underline disabled>Text Button<template #suffix><OIconChevronRight /></template></OLink>
  </div>
</template>
