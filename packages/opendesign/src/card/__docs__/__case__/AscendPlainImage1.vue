<docs lang="md">
<!-- zh-CN -->

#### 纯图卡片

纯图卡片使用 `OFigure` 组件实现：

1. 当内容在卡片底部时，使用 `title` 插槽插入文案
2. 当内容从上部开始，使用 `default` 插槽插入内容。深色背景图片可使用使用深色主题，浅色背景图片可使用浅色主题，从而提高内容的对比度。
3. 可交互的纯图卡片要求鼠标悬停或按下时放大图片，需设置`hoverable`属性为`true`
4. 给 `OFigure` 添加 `c-figure-ascend-radius` 类名使用 `L` 尺寸的圆角，添加 `c-figure-ascend-xl-radius` 类名使用 `XL` 尺寸的圆角

<!-- en-US -->

#### Image-Only Card

Image-Only Cards are implemented using the `OFigure` component:

1. When content is at the bottom of the card, use the `title` slot to insert text.
2. When content starts from the top, use the `default` slot to insert content.
   For dark background images, the dark theme can be used; for light background images, the light theme can be used to improve content contrast.
3. Interactive Image-Only Cards require images to zoom in when hovered over or pressed. Set the `hoverable` property to `true`.
4. Add the `c-figure-ascend-radius` class to `OFigure` to use the L-sized border radius,
   and add the `c-figure-ascend-xl-radius` class to use the XL-sized border radius.
</docs>
<script setup lang="ts">
import { OFigure } from '@opensig/opendesign';
</script>
<template>
  <OFigure src="/card-cover.jpg" hoverable class="plain-image-card c-figure-ascend-radius">
    <template #title>Image card text</template>
  </OFigure>
</template>
<style lang="scss" scoped>
.plain-image-card {
  max-width: 600px;
}
</style>
