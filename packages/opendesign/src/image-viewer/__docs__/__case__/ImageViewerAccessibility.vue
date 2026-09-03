<docs lang="md">
<!-- zh-CN -->

### 无障碍

`OImageViewer` 内置无障碍支持：

- `focus-trap`（默认 `true`）：启用焦点陷阱，预览打开后 Tab 键在组件内循环聚焦，不会溢出到背景页面。
- 所有操作按钮（缩小、放大、重置、旋转、关闭）与导航按钮（上一张、下一张）均带 `aria-label`，屏幕阅读器可正确朗读按钮用途。
- 支持键盘导航：
  - `←` / `→` 切换上一张 / 下一张图片
  - `↑` / `↓` 或 `+` / `-` 缩放
  - `ESC` 关闭预览（受 `close-on-press-escape` 控制，默认 `true`）

下方示例打开预览后，可尝试用 Tab 键在工具栏按钮间循环聚焦，用方向键切换图片，按 ESC 关闭。

<!-- en-US -->

### Accessibility

`OImageViewer` ships with built-in accessibility:

- `focus-trap` (default `true`): Enables focus trapping — Tab cycles within the component after the preview opens, never leaking to the background page.
- All action buttons (zoom out, zoom in, reset, rotate, close) and navigation buttons (prev, next) carry `aria-label`s so screen readers announce their purpose correctly.
- Keyboard navigation:
  - `←` / `→` switch to the previous / next image
  - `↑` / `↓` or `+` / `-` to zoom
  - `ESC` closes the preview (controlled by `close-on-press-escape`, default `true`)

Open the preview below, then try Tabbing between toolbar buttons, using arrow keys to switch images, and pressing ESC to close.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

const imgList = ['https://www.openeuler.org/img/banners/20230418-odd.png', 'https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG'];
const visible = ref(false);

const onShow = () => {
  visible.value = true;
};
const onClose = () => {
  visible.value = false;
};
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" @click="onShow">显示预览（体验无障碍）</OButton>
    <OImageViewer
      v-model:visible="visible"
      :preview-list="imgList"
      :current-index="0"
      :focus-trap="true"
      :close-on-press-escape="true"
      :show-progress="true"
      @close="onClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}
</style>
