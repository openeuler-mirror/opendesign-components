<docs lang="md">
<!-- zh-CN -->

### 在 ODialog 中使用

`OPopup` 可以直接嵌套在 `ODialog` 内使用：

- 弹层显示时会自动获取顶层 z-index，渲染在对话框蒙层之上，不会被对话框遮挡；
- 对话框内容区滚动时，弹层会跟随触发元素移动（弹层内部监听了触发元素的滚动父链）；
- 对话框关闭时，其插槽内的 `OPopup` 随之一并销毁。

<!-- en-US -->

### Nested in ODialog

`OPopup` can be nested directly inside `ODialog`:

- When shown, the popup acquires a top-level z-index automatically and renders above the dialog mask;
- When the dialog body scrolls, the popup follows its trigger element (the popup listens to the scroll parent chain of the trigger internally);
- When the dialog closes, the `OPopup` inside its slot is destroyed together with it.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { ODialog, OPopup, OButton } from '@opensig/opendesign';

const visible = ref(false);
const rows = Array.from({ length: 20 }, (_, i) => `列表第 ${i + 1} 行`);
const openDialog = () => {
  visible.value = true;
};
</script>
<template>
  <OButton color="primary" @click="openDialog">打开对话框</OButton>
  <ODialog v-model:visible="visible" size="medium">
    <template #header>对话框内嵌弹层</template>
    <div class="demo-dlg-popup-body">
      <p class="demo-dlg-popup-tip">点击下方按钮展开弹层，弹层渲染在对话框之上；滚动列表时弹层会跟随触发元素移动。</p>
      <OPopup trigger="click" position="bottom" :offset="8" anchor wrap-class="demo-popup-case">
        <div class="demo-popup-panel">嵌套弹层内容：渲染在对话框蒙层之上。</div>
        <template #anchor>
          <div class="demo-popup-arrow"></div>
        </template>
        <template #target>
          <OButton color="primary" variant="outline">对话框内触发</OButton>
        </template>
      </OPopup>
      <ul class="demo-dlg-popup-list">
        <li v-for="(row, i) in rows" :key="i">{{ row }}</li>
      </ul>
    </div>
  </ODialog>
</template>
<style lang="scss">
// 弹层内容 Teleport 到 body，需通过 wrapClass 提供非 scoped 的外观定制
.demo-popup-case {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-bd: 1px solid var(--o-color-control4);
  --popup-padding: 8px 12px;

  color: var(--o-color-info1);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}

// 锚点箭头：position=bottom 时指向下方触发元素
.demo-popup-arrow {
  width: 8px;
  height: 8px;
  background-color: var(--popup-bg-color);
  border: var(--popup-bd);
  border-bottom: none;
  border-right: none;
  border-top-left-radius: 2px;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>
<style lang="scss" scoped>
.demo-dlg-popup-tip {
  margin: 0 0 var(--o-gap-3);
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
}

.demo-dlg-popup-list {
  margin: var(--o-gap-4) 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: var(--o-gap-1) 0;
    border-bottom: 1px solid var(--o-color-control1);
  }
}
</style>
