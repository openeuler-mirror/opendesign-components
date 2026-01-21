<docs lang="md">
<!-- zh-CN -->

### 自定义指示器

可以通过 `indicator` 插槽自定义指示器。`indicator` 是一个作用域插槽，接收 `index` 和 `active` 参数，分别表示当前指示器的索引和当前指示器是否激活。

<!-- en-US -->

### Custom indicator

You can customize the indicator by using the `indicator` slot. The `indicator` slot is a scope slot that receives `index` and `active` parameters,
which represent the index of the current indicator and whether the current indicator is active.

</docs>
<script setup lang="ts">
import { OCarousel, OCarouselItem } from '@opensig/opendesign';
const pages = [
  { content: 'welcome join opendesign', title: 'welcome' },
  { content: 'opendesign is a free and open source vue component library', title: 'open source' },
  { content: 'thank you for using opendesign', title: 'thank you' },
];
</script>
<template>
  <div class="carousel-wrapper">
    <OCarousel indicator-click class="carousel-custom-style" arrow="always">
      <OCarouselItem v-for="(item, idx) in pages" :key="idx" class="carousel-item">{{ item.content }}</OCarouselItem>
      <template #indicator="{ active, index }">
        <div class="indicator" :class="{ active }">{{ pages[index].title }}</div>
      </template>
    </OCarousel>
  </div>
</template>
<style lang="scss" scoped>
// custom indicator style
.indicator {
  color: var(--o-color-info1);
  cursor: pointer;
  width: 6em;
  text-align: center;
  &.active {
    font-weight: 700;
    transform: scale(1.2);
  }
}
.carousel-custom-style {
  height: 300px;
  overflow: hidden;
}
.carousel-item {
  height: 100%;
  width: 100%;
  color: #fff;
  text-align: center;
  font-size: var(--o-font_size-h3);
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
