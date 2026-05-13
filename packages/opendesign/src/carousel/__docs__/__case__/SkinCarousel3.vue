<docs lang="md">
<!-- zh-CN -->

#### 首页轮播

<!-- en-US -->

#### Homepage carousel
</docs>
<script setup lang="ts">
import { OCarousel, OCarouselItem, useScreen } from '@opensig/opendesign';

const { isPhonePad } = useScreen();

const list = [
  { title: '昇腾AI创新大赛', detail: '旗舰赛道，全新子赛事，等你来挑战！' },
  { title: '昇腾CANN开源开放', detail: '拆解CANN全面开源开放背后的深层故事' },
  { title: '社区贺岁', detail: '喜迎2026' },
  { title: '模型轻量化部署', detail: '助力掌握模型轻量化部署的核心能力' },
  { title: 'AI开源实习生招募', detail: '6大领域、10大重点方向，欢迎投递，共同参与开源开放' },
];
const num = list.length;
</script>
<template>
  <OCarousel auto-play pause-on-hover indicator-click class="demo-usage-carousel-wrap">
    <!-- 社区1200以下不显示自定义指示器 -->
    <template v-if="!isPhonePad" #indicator="{ active, index }" :key="idx">
      <div class="carousel-indicator">
        <div
          class="o-carousel-indicator-bar"
          :class="{
            'o-carousel-indicator-bar-selected': active,
          }"
        >
          <div class="o-carousel-indicator-line"></div>
        </div>
        <div class="carousel-indicator-content">
          <div class="indicator-title">{{ list[index].title }}</div>
          <div class="indicator-detail">{{ list[index].detail }}</div>
        </div>
      </div>
    </template>
    <OCarouselItem v-for="i in num" :key="i" :class="['carousel-item-content', `item-${i}`]">{{ i }}</OCarouselItem>
  </OCarousel>
</template>
<style scoped lang="scss">
.demo-usage-carousel-wrap {
  --carousel-indicator-width: 100%;
  --carousel-indicator-gap: 48px;
  --carousel-indicator-offset: 24px;
  --carousel-indicator-height: 2px;

  --demo-usage-carousel-wrap-height: 560px;

  height: var(--demo-usage-carousel-wrap-height);
  overflow: hidden;

  @include respond('<=laptop') {
    --carousel-indicator-offset: 16px;
    --carousel-indicator-gap: 24px;

    --demo-usage-carousel-wrap-height: 400px;
  }
  @include respond('<=pad') {
    --carousel-indicator-width: 48px;
    --carousel-indicator-gap: 8px;
    --carousel-indicator-offset: 0;

    --demo-usage-carousel-wrap-height: 320px;
  }

  @include respond('<=pad_v') {
    --carousel-indicator-width: 16px;
    --carousel-indicator-gap: 4px;
    --carousel-indicator-offset: 12px;

    --demo-usage-carousel-wrap-height: 184px;
  }
}
:deep(.o-carousel-indicator-item) {
  width: 160px;
  @include respond('<=laptop_s') {
    width: 120px;
  }
  @include respond('<=pad') {
    width: auto;
  }
}

:deep(.o-carousel-indicator-bar) {
  @include respond('<=pad') {
    height: 30px;
  }
  @include respond('<=pad_v') {
    height: auto;
  }
}

.carousel-indicator {
  cursor: pointer;
  @include hover {
    .indicator-title,
    .indicator-detail {
      color: var(--o-color-info1);
    }
  }
}

.o-carousel-indicator-bar {
  height: auto;
}

.carousel-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--o-color-white);
  text-align: center;
  font-size: var(--o-font_size-h1);
  &.item-1 {
    background-color: #f0b70a;
  }
  &.item-2 {
    background-color: #da720a;
  }
  &.item-3 {
    background-color: #e74a3b;
  }
  &.item-4 {
    background-color: #408e93;
  }
  &.item-5 {
    background-color: #cadd20;
  }
}

.carousel-indicator-content {
  margin-top: 16px;
  @include respond('<=laptop') {
    margin-top: 12px;
  }
}

.indicator-title {
  font-size: var(--o-font_size-text2);
  line-height: var(--o-line_height-text2);
  font-weight: 600;

  @include respond('<=laptop') {
    font-size: var(--o-font_size-text1);
    line-height: var(--o-line_height-text1);
  }
}

.indicator-detail {
  margin-top: 8px;
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  @include respond('<=laptop') {
    font-size: var(--o-font_size-tip2);
    line-height: var(--o-line_height-tip2);
  }
}
</style>
