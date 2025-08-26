<docs lang="md">
<!-- zh-CN -->

#### 链接按钮（带链接功能的文本按钮）

- **功能定位**：用于跳转外部/内部链接的按钮
- **配置方式**：
  使用 `OLink` 组件，传递 `hover-underline`（悬停下划线） + `color="primary"`（链接主色样式）参数

<!-- en-US -->

#### Link Buttons (Text Buttons with Link Functionality)

- **Functional Positioning**: Used for buttons that navigate to external/internal links.
- **Configuration Method**:
  Use the `OLink` component, passing the `hover-underline` (hover underline) + `color="primary"` (link primary color style) parameters.

</docs>
<script setup lang="ts">
import { OLink } from '@opensig/opendesign';
</script>
<template>
  <div class="row">
    <OLink hover-underline color="primary">Link Button</OLink>
    <OLink hover-underline color="primary" disabled>Link Button</OLink>
  </div>
</template>
