<docs lang="md">
<!-- zh-CN -->

### 手动控制预览

通过调用 `OFigure` 实例的 `preview(boolean)` 方法，可以手动控制预览的显示与隐藏。注意：

- 设置 `lazy-preview` 属性为 `true` 以启用预览功能
- 可以设置 `preview-close="none"` 属性禁用默认关闭行为，然后通过 `preview(false)` 方法自定义关闭预览的方式

<!-- en-US -->

### Manual Preview Control

You can manually control the display and hiding of the preview by calling the `preview(boolean)` method of the `OFigure` instance. Note:

- Set the `lazy-preview` attribute to `true` to enable the preview functionality
- You can set the `preview-close="none"` attribute to disable the default close behavior,
  and then use the `preview(false)` method to customize how the preview is closed
</docs>
<script setup lang="ts">
import { OFigure, OButton, OIcon, OIconClose } from '@opensig/opendesign';
import { useTemplateRef } from 'vue';

const figure = useTemplateRef('figure');
const togglePreview = (visible: boolean) => {
  figure.value?.preview(visible);
};
</script>
<template>
  <OButton @click="togglePreview(true)">Open preview</OButton>
  <OFigure ref="figure" src="/card-cover.jpg" lazy-preview preview-close="none" class="figure">
    <template #preview-extra>
      <div class="extra">
        <OIcon button :icon="OIconClose" class="ctr-icon" @click="togglePreview(false)" />
      </div>
    </template>
  </OFigure>
</template>
<style scoped lang="scss">
.figure {
  display: block;
  margin-top: 12px;
  max-width: 500px;
}
.extra {
  background-color: var(--o-color-fill2);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--o3-gap-2) var(--o3-gap-4);
  gap: var(--o-gap-3);
}
.ctr-icon {
  font-size: var(--o-icon_size-m);
}
</style>
