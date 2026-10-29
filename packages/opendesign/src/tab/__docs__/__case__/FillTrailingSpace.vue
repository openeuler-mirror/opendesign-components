<docs lang="md">
<!-- zh-CN -->

### 溢出尾部无空白 ^[1.2.5-sp5](primary)

无 `maxShow` 时，桌面端页签溢出采用“全量渲染 + 容器裁切”：拖动滑块缩小容器宽度，页签栏右端始终被内容填满——最后被裁切的页签伸入渐变阴影自然淡出，不再出现“不足一个页签宽”的尾部空白。不完全可见的页签收入省略号弹层，其露出的可见部分仍可直接点击；切换激活项时列表平滑滚动，激活页签保持完整可见，滚动到尾部时末尾页签右缘止于渐变阴影左缘，尾部无空白。可切换尺寸、开启页签关闭按钮，观察溢出几何在尺寸与页签宽度变化下的自适应。

<!-- en-US -->

### No Trailing Whitespace on Overflow ^[1.2.5-sp5](primary)

Without `maxShow`, desktop tab overflow uses full rendering plus container clipping: drag the slider to shrink the container width — the tab bar stays filled to the right edge, and the last clipped tab fades out naturally in the gradient shadow, so no "less-than-one-tab" trailing gap appears. Incompletely visible tabs are collected into the ellipsis popup, while their visible parts remain directly clickable; switching the active tab scrolls the list smoothly and keeps the active tab fully visible, and scrolling to the end stops the last tab's right edge at the left edge of the gradient shadow, leaving no trailing blank. Switch the size or enable the close buttons to observe how the overflow geometry adapts to size and tab-width changes.
</docs>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OCard, OOption, OSelect, OSlider, OSwitch, OTab, OTabPane } from '@opensig/opendesign';

const activeTab = ref('tab20');

const tabs = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    label: `Tab ${i + 1}`,
    value: `tab${i + 1}`,
    content: `Content ${i + 1}`,
  })),
);

/** 页签容器可用宽度（200–1000px），直接复现溢出场景 */
const containerWidth = ref(600);
/** 页签尺寸（省略号与页签本体宽随尺寸变化） */
const size = ref<'small' | 'medium' | 'large'>('medium');
/** 是否可关闭（关闭按钮参与页签宽度几何，验证溢出收口） */
const closable = ref(false);

/** 业务侧响应 delete 事件：从状态中移除对应页签 */
const delTab = (val: string | number) => {
  const index = tabs.findIndex((item) => item.value === val);
  if (index !== -1) {
    tabs.splice(index, 1);
  }
};
</script>

<template>
  <div class="fill-trailing-controls">
    <span class="fill-trailing-label">容器宽度 {{ containerWidth }}px</span>
    <OSlider v-model="containerWidth" :min="200" :max="1000" :step="10" class="fill-trailing-slider" />
    <OSelect v-model="size" class="fill-trailing-select">
      <OOption value="small" label="small" />
      <OOption value="medium" label="medium" />
      <OOption value="large" label="large" />
    </OSelect>
    <span class="fill-trailing-label">closable</span>
    <OSwitch v-model="closable" />
  </div>
  <OCard>
    <template #main>
      <div class="fill-trailing-tab" :style="{ width: `${containerWidth}px` }">
        <OTab v-model="activeTab" :size="size" @delete="delTab">
          <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value" :closable="closable">
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

.fill-trailing-select {
  width: 110px;
}

.fill-trailing-tab {
  max-width: 100%;

  @include respond('<=pad_v') {
    width: 100% !important;
  }
}
</style>
