<docs lang="md">
<!-- zh-CN -->

#### 复合卡片

鲲鹏主题要求文本按钮 hover 时文字变红并显示红色下划线：

1. 使用 `OLink` 组件
2. 设置 `:hover-underline="true"` 且添加 `c-link-kunpeng` 类名

参考：[文本按钮](/zh-CN/components/button?__skin=k#文本按钮（无背景，无线框）)

<!-- en-US -->

#### Composite Card

The Kunpeng Theme requires that the text of a text button turns red and displays a red underline on hover:

1. Use the `OLink` component
2. Set `:hover-underline="true"` and add the `c-link-kunpeng` class name

Reference: [Text Button](/en-US/components/button?__skin=k#text-buttons(no-background,no-border))
</docs>
<script setup lang="ts">
import { OCard, OLink } from '@opensig/opendesign';
</script>
<template>
  <OCard title="Composite card title" detail="Composite card detail" cover="/card-cover.jpg" class="c-card-kunpeng composite-image-card">
    <template #footer>
      <OLink v-for="i in 2" :key="i" tag="span" hover-underline class="c-link-kunpeng row-item"
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
