<docs lang="md">
<!-- zh-CN -->

#### 纯图卡片

纯图卡片使用 `OFigure` 组件实现：

1. 当内容在卡片底部时，使用 `title` 插槽插入文案
2. 当内容从上部开始，使用 `default` 插槽插入内容。深色背景图片可使用使用深色主题，浅色背景图片可使用浅色主题，从而提高内容的对比度。
3. 可交互的纯图卡片要求鼠标悬停或按下时放大图片，需设置`hoverable`属性为`true`
4. 可通过给 `OFigure` 添加 `c-figure-kunpeng-radius` 类名应用符合规范的卡片圆角样式

<!-- en-US -->

#### Image-Only Card

The Image-Only Card is implemented using the `OFigure` component:

1. When content is positioned at the bottom of the card, use the `title` slot to insert text.
2. When content starts from the top of the card, use the `default` slot to insert content.
   For dark background images, the dark theme can be applied; for light background images, the light theme can be applied to improve content contrast.
3. Interactive Image-Only Cards require images to enlarge on hover or press. Set the `hoverable` prop to `true`.
4. A spec-compliant card border radius style can be applied by adding the `c-figure-kunpeng-radius` class name to `OFigure`.
</docs>
<script setup lang="ts">
import { OFigure } from '@opensig/opendesign';
</script>
<template>
  <OFigure src="/card-cover.jpg" hoverable class="plain-image-card c-figure-kunpeng-radius">
    <template #title>Image card text</template>
  </OFigure>
</template>
<style lang="scss" scoped>
.plain-image-card {
  max-width: 600px;
}
</style>
