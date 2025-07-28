<docs lang="md">
<!-- zh-CN -->
### 自定义箭头

可以通过 `arrow-prev` 和 `arrow-next` 插槽自定义箭头。如果只是想替换箭头图标应该使用 `arrow-pre-icon` 和 `arrow-next-icon` 插槽。

<!-- en-US -->
### Custom Arrow
You can customize the arrow by using the `arrow-prev` and `arrow-next` slots. If you only want to replace the arrow icon, use the `arrow-pre-icon` and `arrow-next-icon` slots.
</docs>
<script setup lang="ts">
import { OCarousel, OCarouselItem, OIconArrowLeft, OIconArrowRight } from '@opensig/opendesign';
</script>
<template>
  <div class="carousel-wrapper">
    <OCarousel class="carousel-custom-style" arrow="always">
      <OCarouselItem class="carousel-item">1</OCarouselItem>
      <OCarouselItem class="carousel-item">2</OCarouselItem>
      <OCarouselItem class="carousel-item">3</OCarouselItem>
      <template #arrow-prev>
        <div class="arrow left">
          <OIconArrowLeft />
        </div>
      </template>
      <template #arrow-next>
        <div class="arrow right">
          <OIconArrowRight />
        </div>
      </template>
    </OCarousel>
  </div>
</template>
<style lang="scss" scoped>
// custom indicator style
.arrow {
  position: absolute;
  width: 60px;
  height: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--o-icon_size-m);
  color: var(--o-color-info1-inverse);
  z-index: 2;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }
}
.carousel-custom-style {
  height: 300px;
  overflow: hidden;
}
.carousel-item {
  height: 100%;
  width: 100%;
  color: var(--o-color-info1-inverse);
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
