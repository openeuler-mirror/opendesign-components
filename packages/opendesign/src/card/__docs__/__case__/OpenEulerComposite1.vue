<docs lang="md">
<!-- zh-CN -->

#### 复合卡片

欧拉主题中文本按钮无下划线，因此 `OLink` 组件的 `underline` 属性应设置为 `false`（默认值）

参考：[文本按钮](/zh-CN/components/button#文本按钮（无背景，无线框）)

<!-- en-US -->

#### Composite Card

In the Euler Theme, text buttons have no underline, so the `underline` prop of the `OLink` component should be set to `false` (default value).

Reference: [Text Button](/en-US/components/button#text-buttons-(no-background%2C-no-border))
</docs>
<script setup lang="ts">
import { OCard, OLink } from '@opensig/opendesign';
</script>
<template>
  <OCard title="Composite card title" detail="Composite card detail" cover="/card-cover.jpg" class="c-card-openeuler composite-image-card">
    <template #footer>
      <OLink v-for="i in 2" :key="i" tag="span" class="row-item"
        >Text Button<template #suffix><OIconChevronRight /></template
      ></OLink>
    </template>
  </OCard>
</template>
<style lang="scss" scoped>
.composite-image-card {
  max-width: 360px;
}
.row-item + .row-item {
  margin-left: 16px;
}
</style>
