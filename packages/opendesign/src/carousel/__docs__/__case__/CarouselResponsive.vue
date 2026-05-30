<docs lang="md">
<!-- zh-CN -->

### 响应式分页

根据视口宽度动态调整每页数据条数，`OCarousel` 内部会自动感知子元素增减并刷新指示器、Effect 内部 slideList 状态：

- `>pad`（屏宽 > 1200px）：每页 5 条 → 3 个轮播页
- `<=pad`（屏宽 ≤ 1200px）：每页 4 条 → 4 个轮播页

调整浏览器窗口宽度跨过 1200px 断点观察轮播页数与指示器的变化。

<!-- en-US -->

### Responsive Paging

The number of items per page changes with the viewport. `OCarousel` automatically detects child mutations and refreshes the indicator and the internal slide list of its effect instance:

- `>pad` (viewport > 1200px): 5 items per page → 3 pages
- `<=pad` (viewport ≤ 1200px): 4 items per page → 4 pages

Resize the browser across the 1200px breakpoint to see the page count and indicator update.
</docs>

<script setup lang="ts">
import { computed } from 'vue';
import { OCarousel, OCarouselItem, useScreen } from '@opensig/opendesign';
import { chunk } from '../../../_utils/helper';

const { isPadSize } = useScreen();

const items = Array.from({ length: 15 }, (_, i) => i + 1);

const pages = computed(() => chunk(items, isPadSize.value ? 4 : 5));
</script>

<template>
  <OCarousel class="carousel-responsive" effect="toggle" :auto-play="false" indicator-click>
    <OCarouselItem v-for="(page, idx) in pages" :key="idx">
      <div class="carousel-responsive-page">
        <div v-for="n in page" :key="n" class="data-card">数据 {{ n }}</div>
      </div>
    </OCarouselItem>
  </OCarousel>
</template>

<style lang="scss" scoped>
.carousel-responsive {
  height: 220px;
  overflow: hidden;

  .carousel-responsive-page {
    display: flex;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .data-card {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--o-color-fill2);
    color: var(--o-color-info1);
    border-radius: var(--o-radius_control-m);
    font-size: var(--o-font_size-h3);
    line-height: var(--o-line_height-h3);
  }
}
</style>
