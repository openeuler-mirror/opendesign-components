<docs lang="md">
<!-- zh-CN -->

### 按钮页签

**注意:** 若使用图标+文本型，请用inline元素(如span)将文本包裹

<!-- en-US -->

### Button mode

**Note:** When using the icon + text pattern, wrap the text with an inline element (such as span).
</docs>
<script setup lang="ts">
import { OTab, OTabPane, OIcon, OIconSearch } from '@opensig/opendesign';
// small和medium是一个大小
const sizes = ['medium', 'large'] as const;
</script>

<template>
  <div class="button-tab-demo">
    <div class="button-tab-demo__item">
      <h4 class="button-tab-demo__title">文本型</h4>
      <OTab v-for="size in sizes" :key="size" :size="size" variant="button">
        <OTabPane label="Tab1"> </OTabPane>
        <OTabPane label="Tab2"> </OTabPane>
        <OTabPane label="Tab3"> </OTabPane>
      </OTab>
    </div>
    <div class="button-tab-demo__item">
      <h4 class="button-tab-demo__title">图标+文本型</h4>
      <OTab v-for="size in sizes" :key="size" :size="size" variant="button">
        <OTabPane label="Tab1">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab1</span></template>
        </OTabPane>
        <OTabPane label="Tab2">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab2</span></template>
        </OTabPane>
        <OTabPane label="Tab3">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab3</span></template>
        </OTabPane>
      </OTab>
    </div>
    <div class="button-tab-demo__item">
      <h4 class="button-tab-demo__title">图标型</h4>
      <OTab v-for="size in sizes" :key="size" :size="size" variant="button">
        <OTabPane label="Tab1">
          <template #nav><OIcon :icon="OIconSearch" /></template>
        </OTabPane>
        <OTabPane label="Tab2">
          <template #nav><OIcon :icon="OIconSearch" /></template>
        </OTabPane>
        <OTabPane label="Tab3">
          <template #nav><OIcon :icon="OIconSearch" /></template>
        </OTabPane>
      </OTab>
    </div>
    <div class="button-tab-demo__item inverse">
      <h4 class="button-tab-demo__title">反色</h4>
      <OTab v-for="size in sizes" :key="size" :size="size" variant="button" button-inverse>
        <OTabPane label="Tab1">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab1</span></template>
        </OTabPane>
        <OTabPane label="Tab2">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab2</span></template>
        </OTabPane>
        <OTabPane label="Tab3">
          <template #nav><OIcon :icon="OIconSearch" /><span>Tab3</span></template>
        </OTabPane>
      </OTab>
    </div>
  </div>
</template>

<style lang="scss">
.button-tab-demo {
  background-color: var(--o-color-fill2);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;

  .o-tab + .o-tab {
    margin-top: 12px;
  }
}
.button-tab-demo__item {
  padding: 16px;

  &.inverse {
    background-color: var(--o-color-fill1);
  }
}
.button-tab-demo__title {
  margin-bottom: 32px;
}
</style>
