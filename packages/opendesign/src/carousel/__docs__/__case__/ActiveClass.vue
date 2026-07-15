<docs lang="md">
<!-- zh-CN -->

### 自定义激活类（activeClass）

通过 `activeClass` 属性可以自定义当前激活幻灯片的样式类。该属性支持 Vue 的三种 class 绑定形式：

- **字符串**：`active-class="my-active"`
- **对象**：`:active-class="{ 'my-active': true, 'my-inactive': false }"`
- **数组**：`:active-class="['my-active-1', { 'my-active-2': true }]""

以下示例使用 `effect="toggle"` 切换效果，激活的幻灯片会通过 `activeClass` 添加高亮边框和缩放动画。

> **注意**：`activeClass` 的类名会直接添加到 `OCarouselItem` 的根元素上。

<!-- en-US -->

### Custom Active Class (activeClass)

Customize the active slide's style class via the `activeClass` prop. It supports three Vue class binding forms:

- **String**: `active-class="my-active"`
- **Object**: `:active-class="{ 'my-active': true, 'my-inactive': false }"`
- **Array**: `:active-class="['my-active-1', { 'my-active-2': true }]""

The following example uses the `toggle` effect. The active slide gets a highlight border and scale animation applied via `activeClass`.

> **Note**: The `activeClass` is added directly to the root element of `OCarouselItem`.
</docs>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { OCarousel, OCarouselItem } from '@opensig/opendesign';

/**
 * activeClass 三种形式切换
 */
const activeClassType = ref<'string' | 'object' | 'array'>('string');

/**
 * 根据选择的形式返回对应的 activeClass 值
 */
const activeClassBinding = computed(() => {
  switch (activeClassType.value) {
    case 'string':
      return 'ac-highlight ac-scale';
    case 'object':
      return { 'ac-highlight': true, 'ac-scale': true, 'ac-hidden': false };
    case 'array':
      return ['ac-highlight', { 'ac-scale': true }];
    default:
      return 'ac-highlight';
  }
});
</script>
<template>
  <div class="active-class-demo">
    <div class="ac-switcher">
      <button
        v-for="t in ['string', 'object', 'array'] as const"
        :key="t"
        :class="['ac-btn', { 'ac-btn-active': activeClassType === t }]"
        @click="activeClassType = t"
      >
        {{ t }}
      </button>
    </div>
    <OCarousel effect="toggle" indicator-click :active-class="activeClassBinding" class="ac-carousel">
      <OCarouselItem v-for="i in 4" :key="i" class="ac-item">
        <div class="ac-item-content">Slide {{ i }}</div>
      </OCarouselItem>
    </OCarousel>
  </div>
</template>
<style lang="scss" scoped>
.active-class-demo {
  padding: 16px 0;
}
.ac-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.ac-btn {
  padding: 4px 12px;
  border: 1px solid var(--o-color-control-light);
  border-radius: var(--o-radius_control-s);
  background: transparent;
  cursor: pointer;
  font-size: var(--o-font_size-text2);
  color: var(--o-color-info1);

  &.ac-btn-active {
    background: var(--o-color-primary);
    border-color: var(--o-color-primary);
    color: var(--o-color-info1-inverse);
  }
}
.ac-carousel {
  height: 240px;
  overflow: hidden;
  border-radius: var(--o-radius_control-l);
}
.ac-item {
  height: 100%;
  width: 100%;
}
.ac-item-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--o-font_size-h2);
  color: var(--o-color-info1-inverse);
  background: linear-gradient(135deg, #4e73df, #36b9cc);
  transition: all 0.4s ease;
}

// activeClass 注入的样式 —— 验证三种形式都能正确添加
.ac-highlight {
  .ac-item-content {
    box-shadow: inset 0 0 0 4px #f6c23e;
  }
}
.ac-scale {
  .ac-item-content {
    transform: scale(0.92);
  }
}
// ac-hidden 对象中设为 false，不应出现
.ac-hidden {
  .ac-item-content {
    opacity: 0.3;
  }
}
</style>
