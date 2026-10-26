<docs lang="md">
<!-- zh-CN -->

### 插槽触发元素定位

通过 `#target` 插槽提供触发元素时，弹层应定位在触发元素附近（此处演示 `position="bottom"`，悬停按钮后弹层出现在按钮正下方 8px 处），而不是停留在页面左上角。

<!-- en-US -->

### Target Slot Positioning

When the trigger element is provided via the `#target` slot, the popup should be positioned near it (this demo uses `position="bottom"` — hover the button and the popup appears 8px below it), instead of staying at the top-left corner of the page.
</docs>
<script setup lang="ts">
import { OPopup, OButton } from '@opensig/opendesign';
</script>
<template>
  <div class="demo-popup-slot-target">
    <OPopup trigger="hover" position="bottom" wrap-class="demo-popup-case">
      <div class="demo-popup-panel">跟随 #target 插槽触发元素定位的弹层内容。</div>
      <template #target>
        <OButton round="pill">hover 定位</OButton>
      </template>
    </OPopup>
  </div>
</template>

<style lang="scss" scoped>
// 触发元素远离页面左上角，使"弹层停留在 (0,0)"与"弹层跟随定位"肉眼可辨
.demo-popup-slot-target {
  padding: 160px 0 120px 320px;
}
</style>
