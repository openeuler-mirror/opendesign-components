<docs lang="md">
<!-- zh-CN -->

#### 楼层轮播

<!-- en-US -->

#### Floor Carousel
</docs>
<script setup lang="ts">
import { OCarousel, OCarouselItem } from '@opensig/opendesign';
</script>
<template>
  <OCarousel class="carousel-skin carousel-floor">
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
