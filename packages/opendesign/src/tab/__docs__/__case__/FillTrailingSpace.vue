<docs lang="md">
<!-- zh-CN -->

### 溢出尾部无空白 ^[1.2.5-sp5](primary)

无 `maxShow` 时，桌面端页签溢出采用"全量渲染 + 容器裁切"：拖动滑块缩小容器宽度，页签栏右端始终被内容填满——最后被裁切的页签伸入渐变阴影自然淡出，不再出现"不足一个页签宽"的尾部空白。不完全可见的页签收入省略号弹层，其露出的可见部分仍可直接点击；切换激活项时列表平滑滚动，激活页签保持完整可见。

<!-- en-US -->

### No Trailing Whitespace on Overflow ^[1.2.5-sp5](primary)

Without `maxShow`, desktop tab overflow uses full rendering plus container clipping: drag the slider to shrink the container width — the tab bar stays filled to the right edge, and the last clipped tab fades out naturally in the gradient shadow, so no "less-than-one-tab" trailing gap appears. Incompletely visible tabs are collected into the ellipsis popup, while their visible parts remain directly clickable; switching the active tab scrolls the list smoothly and keeps the active tab fully visible.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCard, OSlider, OTab, OTabPane } from '@opensig/opendesign';

const tabs = Array.from({ length: 20 }, (_, i) => ({
  label: `Tab ${i + 1}`,
  value: `tab${i + 1}`,
  content: `Content ${i + 1}`,
}));

/** 页签容器可用宽度（200–1000px），直接复现溢出场景 */
const containerWidth = ref(600);
</script>

<template>
  <div class="fill-trailing-controls">
    <span class="fill-trailing-label">容器宽度 {{ containerWidth }}px</span>
    <OSlider v-model="containerWidth" :min="200" :max="1000" :step="10" class="fill-trailing-slider" />
  </div>
  <OCard>
    <template #main>
      <div class="fill-trailing-tab" :style="{ width: `${containerWidth}px` }">
        <OTab>
          <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value">
            {{ tab.content }}
          </OTabPane>
        </OTab>
      </div>
    </template>
  </OCard>
</template>

<style lang="scss" scoped>
.fill-trailing-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.fill-trailing-label {
  white-space: nowrap;
  font-size: var(--o-font_size-text3);
  color: var(--o-color-info2);
}

.fill-trailing-slider {
  flex: 1;
}

.fill-trailing-tab {
  max-width: 100%;

  @include respond('<=pad_v') {
    width: 100% !important;
  }
}
</style>
