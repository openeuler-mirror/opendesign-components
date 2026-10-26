<docs lang="md">
<!-- zh-CN -->

### 居中引导

当 `OTourStep` 不设置 `target` 时，引导卡片在视口居中显示，不指向具体元素。适用于整体介绍、欢迎页或无明确目标的引导场景。

<!-- en-US -->

### Centered Tour

When `OTourStep` does not set `target`, the guide card is centered in the viewport without pointing to a specific element. Suitable for overall introductions, welcome pages, or guidance without a specific target.
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
</script>
<template>
  <div class="demo-tour-center-doc">
    <OButton @click="show = true">开启居中引导</OButton>

    <div class="demo-tour-content">
      <p>页面内容区域</p>
      <p>引导卡片会在视口居中展示，覆盖在内容之上。</p>
    </div>

    <OTour v-model:visible="show">
      <OTourStep
        title="欢迎使用漫游引导"
        detail="当 OTourStep 不设置 target 时，引导卡片在视口居中显示，不指向具体元素，适用于整体介绍或无明确目标的引导场景。"
      >
        <template #skip>
          <div @click="show = false"><OLink :hover-underline="false">跳过</OLink></div>
        </template>
      </OTourStep>
    </OTour>
  </div>
</template>
<style lang="scss" scoped>
.demo-tour-content {
  margin-top: 16px;
  padding: 24px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-m);
  background: var(--o-color-fill1);

  p {
    margin: 0;
    font-size: var(--o-font_size-text1);
    color: var(--o-color-info2);
  }
}
.o-link {
  --link-color: var(--o-color-info4);
}
</style>
