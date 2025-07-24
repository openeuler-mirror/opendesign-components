<docs lang="md">
<!-- zh-CN -->

### 自定义样式

通过 `arrowWrapClass` 和 `indicatorWrapClass` 可以分别给箭头和指示器的容器添加类名，从而实现自定义样式。

还可以通过 css 变量来自定义箭头或指示器的样式：

- `--carousel-arrow-size`: 箭头大小
- `--carousel-arrow-color`: 箭头颜色
- `--carousel-arrow-color-hover`: 箭头 hover 颜色
- `--carousel-arrow-color-active`: 箭头按下颜色
- `--carousel-indicator-width`: 指示器宽度
- `--carousel-indicator-height`: 指示器高度
- `--carousel-indicator-gap`: 指示器间距
- `--carousel-indicator-offset`: 指示器距离容器底部的距离
- `--carousel-indicator-bg-color`: 指示器背景色
- `--carousel-indicator-bg-color-hover`: 指示器 hover 背景色
- `--carousel-indicator-bg-color-active`: 指示器激活背景色
- `--carousel-indicator-bg-color-selected`: 指示器按下背景色

**注**：由于 `OCarouselItem` 组件的父容器的 `position` 值为 `absolute`，会导致 `OCarousel` 的高度塌陷，因此应该明确给 `OCarousel` 设置高度，如 `height: 300px;`

<!-- en-US -->

### Custom Styles

By using `arrowWrapClass` and `indicatorWrapClass`, you can add custom class names to the arrow and indicator containers respectively to achieve custom styling.

You can also customize the arrow or indicator styles through CSS variables:

- `--carousel-arrow-size`: Arrow size
- `--carousel-arrow-color`: Arrow color
- `--carousel-arrow-color-hover`: Arrow hover color
- `--carousel-arrow-color-active`: Arrow active color
- `--carousel-indicator-width`: Indicator width
- `--carousel-indicator-height`: Indicator height
- `--carousel-indicator-gap`: Indicator spacing
- `--carousel-indicator-offset`: Indicator distance from container bottom
- `--carousel-indicator-bg-color`: Indicator background color
- `--carousel-indicator-bg-color-hover`: Indicator hover background color
- `--carousel-indicator-bg-color-active`: Indicator active background color
- `--carousel-indicator-bg-color-selected`: Indicator selected background color

**Note**: Since the `position` value of the parent container of the `OCarouselItem` component is set to `absolute`, it will cause the height collapse of `OCarousel`. Therefore, you should explicitly set a height for `OCarousel`, such as `height: 300px;`.
</docs>

<script setup lang="ts">
import { OCarousel, OCarouselItem } from '@opensig/opendesign';
</script>
<template>
  <div class="carousel-wrapper">
    <OCarousel class="carousel-custom-style" arrow="always">
      <OCarouselItem class="carousel-item">1</OCarouselItem>
      <OCarouselItem class="carousel-item">2</OCarouselItem>
      <OCarouselItem class="carousel-item">3</OCarouselItem>
    </OCarousel>
  </div>
</template>
<style lang="scss" scoped>
.carousel-wrapper {
  overflow: hidden;
}
.carousel-custom-style {
  // Explicitly set the height of the carousel
  height: 300px;
  // The space between the carousel and the indicator
  margin-bottom: 24px;
  // Move the indicators outside the carousel
  --carousel-indicator-offset: -20px;
  // Set the color of the indicators
  --carousel-arrow-color: #fff;
  // Set the hover color of the indicators
  --carousel-arrow-color-hover: var(--o-color-info3-inverse);
}
.carousel-item {
  height: 100%;
  width: 100%;
  color: #fff;
  text-align: center;
  line-height: 300px;
  font-size: var(--o-font_size-h1);
  &:nth-child(1) {
    background-color: #4e73df;
  }
  &:nth-child(2) {
    background-color: #36b9cc;
  }
  &:nth-child(3) {
    background-color: #f6c23e;
  }
}
</style>
