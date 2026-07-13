<docs lang="md">
<!-- zh-CN -->

### 移动端溢出 ^[NEXT](primary)

在触屏设备且屏幕宽度 ≤ pad_v 断点（840px）时，页签导航自动切换为横向滚动模式：所有页签平铺展示，溢出内容可通过滑动到达，并在左右两侧显示渐变遮罩以提示溢出方向。桌面端保持原有的省略号折叠交互。

<!-- en-US -->

### Mobile Overflow ^[NEXT](primary)

On touch devices with screen width ≤ pad_v breakpoint (840px), the tab nav automatically switches to horizontal scroll mode: all tabs are laid out inline, overflowing content can be reached by swiping, and gradient shadows appear on both sides to indicate the overflow direction. Desktop retains the original ellipsis collapse interaction.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCard, OSelect, OOption, OTab, OTabPane } from '@opensig/opendesign';

const tabs = Array.from({ length: 20 }, (_, i) => ({
  label: `Tab ${i + 1}`,
  value: i + 1,
  content: `Content ${i + 1}`,
}));

/** 当前激活的页签值，与 OTab 和 OSelect 双向绑定 */
const activeValue = ref<number>(1);
</script>

<template>
  <div class="mb-overflow-controls">
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
.mb-overflow-controls {
  margin-bottom: 12px;
}
</style>
