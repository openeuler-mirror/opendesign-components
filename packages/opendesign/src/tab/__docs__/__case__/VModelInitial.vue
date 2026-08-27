<docs lang="md">
<!-- zh-CN -->

### 双向绑定与初始激活

通过 `v-model` 双向绑定激活页签。当初始值不为第一个页签时，组件应在挂载后正确激活该页签并展示对应内容。

下方用例设置 15 个页签并将初始激活项设为倒数第二个，可重点观察以下行为：

- **桌面端**：超出 `max-show` 或溢出的页签折叠到「更多」中，激活项若被折叠则自动展开并选中。
- **移动端（≤840px）**：所有页签平铺为横向滚动，激活页签在挂载时自动滚动到容器可视区域居中位置。若激活项靠近末尾，可验证右边缘 clamp 行为——滚动不会超出内容边界，也不会回弹到首项。
- **切换验证**：通过下拉选择器切换到任意页签，观察 nav 容器是否仅水平滚动到目标位置，页面垂直方向不应发生跳动。

<!-- en-US -->

### Two-way Binding with Initial Value

Bind the active tab via `v-model`. When the initial value is not the first tab, the component should correctly activate that tab on mount and display its content.

The case below creates 15 tabs with the initial active value set to the second-to-last tab, allowing you to verify the following behaviors:

- **Desktop**: Tabs exceeding `max-show` or overflowing are collapsed into a "More" dropdown; if the active tab is collapsed, it automatically expands and selects.
- **Mobile (≤840px)**: All tabs are laid out as a horizontal scroll list; the active tab is automatically scrolled to the center of the container's visible area on mount. When the active tab is near the end, this verifies the right-edge clamp behavior — scrolling stays within content bounds and does not bounce back to the first tab.
- **Switching**: Use the dropdown selector to switch to any tab and observe whether the nav container only scrolls horizontally to the target position without any vertical page jump.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCard, OSelect, OOption, OTab, OTabPane } from '@opensig/opendesign';

const tabs = Array.from({ length: 15 }, (_, i) => ({
  label: `Tab ${i + 1}`,
  value: `tab${i + 1}`,
  content: `Tab ${i + 1} Content`,
}));

/** 初始激活倒数第二个页签，验证末尾项的居中与边缘 clamp 行为 */
const activeValue = ref('tab14');
</script>

<template>
  <div class="vmodel-initial-controls">
    <OSelect v-model="activeValue" size="small" placeholder="选择页签">
      <OOption v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value" />
    </OSelect>
  </div>
  <OCard>
    <template #main>
      <OTab v-model="activeValue">
        <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value">
          {{ tab.content }}
        </OTabPane>
      </OTab>
    </template>
  </OCard>
</template>

<style lang="scss" scoped>
.vmodel-initial-controls {
  margin-bottom: 12px;
}
</style>
