<docs lang="md">
<!-- zh-CN -->

### 自定义滑块与轨道

通过 `#thumb` 和 `#track` 插槽自定义滚动条的滑块和轨道样式，实现与品牌主题一致的滚动条外观。

- `#thumb` 与 `#track` 插槽均提供 `direction`（方向）和 `dragging`（是否拖拽中）两个作用域参数 ^[NEXT](primary)`插槽新增 direction 和 dragging 作用域参数`，可据此区分常态与拖拽态样式
- `barClass` 属性可为滚动条根元素添加自定义类名，通过 `:deep` 穿透后利用内部 `.is-dragging` 类同样可区分拖拽态

<!-- en-US -->

### Custom Thumb and Track

Customize the scrollbar thumb and track styles via the `#thumb` and `#track` slots, achieving a scrollbar appearance consistent with the brand theme.

- Both `#thumb` and `#track` slots provide `direction` and `dragging` scoped props ^[NEXT](primary)`Slots now provide direction and dragging scoped props`, enabling distinct normal and dragging styles
- The `barClass` prop adds custom classes to the scrollbar root element; with `:deep` penetration, the internal `.is-dragging` class can also be used to differentiate the dragging state
</docs>

<script setup lang="ts">
import { OScroller } from '@opensig/opendesign';
</script>

<template>
  <div class="demo-custom-wrap">
    <div class="demo-custom-item">
      <h4>自定义滑块与轨道</h4>
      <OScroller class="demo-custom-container" show-type="always">
        <template #thumb="{ direction, dragging }">
          <div :class="['demo-custom-thumb', `demo-custom-thumb-${direction}`, { 'demo-custom-thumb-dragging': dragging }]"></div>
        </template>
        <template #track="{ dragging }">
          <div :class="['demo-custom-track', { 'demo-custom-track-dragging': dragging }]"></div>
        </template>
        <div v-for="i in 15" :key="i" class="demo-custom-section">{{ i }}</div>
      </OScroller>
    </div>
    <div class="demo-custom-item">
      <h4>barClass 自定义类</h4>
      <OScroller class="demo-custom-container" show-type="always" :bar-class="'demo-custom-bar'">
        <div v-for="i in 15" :key="i" class="demo-custom-section">{{ i }}</div>
      </OScroller>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-custom-wrap {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.demo-custom-item {
  flex: 1 1 280px;
}
.demo-custom-container {
  height: 240px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
}
.demo-custom-section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--o-font_size-h4);
  color: var(--o-color-info2);
  &:nth-child(odd) {
    background-color: var(--o-color-fill2);
  }
}

/* 自定义滑块样式——primary2 常态，primary3 拖拽态 */
.demo-custom-thumb {
  border-radius: 4px;
  background-color: var(--o-color-primary2);
  transition: all var(--o-duration-m1) var(--o-easing-standard-in);
}
.demo-custom-thumb-y {
  width: 100%;
  height: 100%;
}
.demo-custom-thumb-x {
  width: 100%;
  height: 100%;
}
.demo-custom-thumb-dragging {
  background-color: var(--o-color-primary3);
}

/* 自定义轨道样式——control1-light 常态，control2-light 拖拽态 */
.demo-custom-track {
  width: 100%;
  height: 100%;
  background-color: var(--o-color-control1-light);
  border-radius: 6px;
  transition: all var(--o-duration-m1) var(--o-easing-standard-in);
}
.demo-custom-track-dragging {
  background-color: var(--o-color-control2-light);
}

/* barClass 自定义类——通过 :deep 穿透 scoped，primary2 常态，primary3 拖拽态 */
:deep(.demo-custom-bar) {
  .o-scrollbar-y-thumb-bar,
  .o-scrollbar-x-thumb-bar {
    background-color: var(--o-color-primary2);
    border-radius: 4px;
    transition: all var(--o-duration-m1) var(--o-easing-standard-in);
    &.is-dragging {
      background-color: var(--o-color-primary3);
    }
  }
}
</style>
