<docs lang="md">
<!-- zh-CN -->

### 鲲鹏、昇腾、欧拉主题规范

规范定义了三种轮播：

- 首页轮播：该轮播指示器具有标题和正文，轮播组件未实现该功能，但可以通过 `indicator` 插槽手动实现，因此该皮肤由社区自己实现
- 内页轮播
- 楼层轮播：目前楼层轮播与内页轮播的区别仅仅是视口小于等于 840px 时指示器宽度不同，添加 `carousel-floor` 类名应用该样式

#### 内页轮播

<!-- en-US -->

### Kunpeng, Ascend, OpenEuler Theme Specifications

The specifications define three types of carousels:

- Homepage Carousel: This carousel indicator includes a title and body text.
  The carousel component does not natively implement this feature, but it can be manually implemented using the `indicator` slot.
  Therefore, this skin should be implemented by the community.
- Inner Page Carousel
- Floor Carousel: Currently, the only difference between the floor carousel and the inner page carousel is the indicator width
  when the viewport is less than or equal to 840px. Apply the `carousel-floor` class name to use this style.

#### Inner Page Carousel
</docs>
<script setup lang="ts">
import { OCarousel, OCarouselItem } from '@opensig/opendesign';
</script>
<template>
  <OCarousel class="carousel-skin">
    <OCarouselItem v-for="i in 3" :key="i" :class="['carousel-item-content', `item-${i}`]">{{ i }}</OCarouselItem>
  </OCarousel>
</template>
<style scoped lang="scss">
.carousel-skin {
  height: 200px;
  overflow: hidden;
  .carousel-item-content {
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 200px;
    font-size: var(--o-font_size-h1);
    &.item-1 {
      background-color: #4e73df;
    }
    &.item-2 {
      background-color: #f6c23e;
    }
    &.item-3 {
      background-color: #e74a3b;
    }
  }
}
</style>
